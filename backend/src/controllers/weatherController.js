import { Parser as CsvParser } from 'json2csv';
import PDFDocument from 'pdfkit';
import Weather from '../models/Weather.js';
import { resolveLocation } from '../services/geocodeService.js';
import { getCurrentWeather, getForecast, getAirQuality, getUvAndAlerts } from '../services/openWeatherService.js';
import { findTravelVideo } from '../services/youtubeService.js';
import { generateWeatherAdvice } from '../services/advisorService.js';
import { buildXmlExport, buildMarkdownExport } from '../services/exportService.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ok, created } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiResponse.js';

/** Groups the 3-hour forecast list into today's hourly slots + 5 daily summaries. */
const buildForecastBreakdown = (forecastList, timezoneOffsetSeconds) => {
  const toLocalDate = (unixSeconds) => new Date((unixSeconds + timezoneOffsetSeconds) * 1000);

  const todayKey = toLocalDate(forecastList[0].dt).toISOString().slice(0, 10);

  const hourlyForecast = forecastList
    .filter((entry) => toLocalDate(entry.dt).toISOString().slice(0, 10) === todayKey)
    .map((entry) => ({
      time: toLocalDate(entry.dt).toISOString().slice(11, 16),
      temp: Math.round(entry.main.temp),
      condition: entry.weather[0].main,
      icon: entry.weather[0].icon,
      pop: Math.round((entry.pop ?? 0) * 100),
    }));

  const byDay = new Map();
  forecastList.forEach((entry) => {
    const day = toLocalDate(entry.dt).toISOString().slice(0, 10);
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day).push(entry);
  });

  const forecast = Array.from(byDay.entries())
    .slice(0, 5)
    .map(([date, entries]) => {
      const temps = entries.map((e) => e.main.temp);
      // Prefer the midday entry for a representative icon/condition
      const midday = entries.reduce((best, e) => {
        const hour = toLocalDate(e.dt).getUTCHours();
        const bestHour = toLocalDate(best.dt).getUTCHours();
        return Math.abs(hour - 13) < Math.abs(bestHour - 13) ? e : best;
      }, entries[0]);
      return {
        date,
        tempMin: Math.round(Math.min(...temps)),
        tempMax: Math.round(Math.max(...temps)),
        condition: midday.weather[0].main,
        icon: midday.weather[0].icon,
        pop: Math.round(Math.max(...entries.map((e) => e.pop ?? 0)) * 100),
      };
    });

  return { hourlyForecast, forecast };
};

/**
 * Runs the full lookup pipeline (geocode -> current + forecast + AQI + UV/alerts)
 * shared by POST /weather and any "refresh" style calls.
 */
const fetchFullWeatherPayload = async ({ location, latitude, longitude, searchTypeOverride }) => {
  const resolved = await resolveLocation({ location, latitude, longitude });

  const [current, forecastRaw, airQuality, uvAndAlerts] = await Promise.all([
    getCurrentWeather(resolved.latitude, resolved.longitude),
    getForecast(resolved.latitude, resolved.longitude),
    getAirQuality(resolved.latitude, resolved.longitude),
    getUvAndAlerts(resolved.latitude, resolved.longitude),
  ]);

  const { hourlyForecast, forecast } = buildForecastBreakdown(forecastRaw.list, current.timezone);

  const currentWeather = {
    temp: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    condition: current.weather[0].main,
    description: current.weather[0].description,
    icon: current.weather[0].icon,
    humidity: current.main.humidity,
    windSpeed: current.wind.speed,
    windDeg: current.wind.deg,
    pressure: current.main.pressure,
    visibility: current.visibility,
    uvIndex: uvAndAlerts.uvIndex,
    sunrise: current.sys.sunrise,
    sunset: current.sys.sunset,
    timezoneOffset: current.timezone,
  };

  const airQualityData = airQuality
    ? {
        aqi: airQuality.main.aqi,
        co: airQuality.components.co,
        no2: airQuality.components.no2,
        o3: airQuality.components.o3,
        pm2_5: airQuality.components.pm2_5,
        pm10: airQuality.components.pm10,
      }
    : undefined;

  return {
    location: location?.trim() || resolved.displayName,
    displayName: resolved.displayName,
    country: resolved.country,
    latitude: resolved.latitude,
    longitude: resolved.longitude,
    searchType: searchTypeOverride || resolved.searchType,
    currentWeather,
    airQuality: airQualityData,
    hourlyForecast,
    forecast,
    alerts: uvAndAlerts.alerts,
  };
};

/**
 * POST /weather
 * Resolves the location, pulls live data from OpenWeatherMap, persists a
 * search-history record, and returns the full weather payload + bonus data.
 */
export const createWeatherSearch = asyncHandler(async (req, res) => {
  const { location, latitude, longitude, sessionId, isCurrentLocation } = req.body;

  const payload = await fetchFullWeatherPayload({
    location,
    latitude,
    longitude,
    searchTypeOverride: isCurrentLocation ? 'current-location' : undefined,
  });

  const record = await Weather.create({ ...payload, userSessionId: sessionId });

  const travelVideo = await findTravelVideo(payload.displayName || payload.location);

  created(res, { ...record.toObject(), travelVideo });
});

/**
 * GET /weather
 * Returns search history, optionally filtered by session / favorites,
 * newest first, paginated.
 */
export const getWeatherHistory = asyncHandler(async (req, res) => {
  const { sessionId, favoritesOnly, page = 1, limit = 20, search } = req.query;

  const filter = {};
  if (sessionId) filter.userSessionId = sessionId;
  if (favoritesOnly === 'true') filter.isFavorite = true;
  if (search) filter.location = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);

  const [records, total] = await Promise.all([
    Weather.find(filter).sort({ timestamp: -1 }).skip(skip).limit(Number(limit)),
    Weather.countDocuments(filter),
  ]);

  ok(res, records, { total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
});

/** GET /weather/:id — a single stored record. */
export const getWeatherById = asyncHandler(async (req, res) => {
  const record = await Weather.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Weather record not found');
  ok(res, record);
});

/**
 * PUT /weather/:id
 * Supports toggling favorite status and/or refreshing the stored weather
 * snapshot for that same location.
 */
export const updateWeatherRecord = asyncHandler(async (req, res) => {
  const record = await Weather.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Weather record not found');

  if (typeof req.body.isFavorite === 'boolean') {
    record.isFavorite = req.body.isFavorite;
  }

  if (req.body.refresh === true) {
    const payload = await fetchFullWeatherPayload({
      latitude: record.latitude,
      longitude: record.longitude,
    });
    Object.assign(record, payload, { timestamp: new Date() });
  }

  await record.save();
  ok(res, record);
});

/** DELETE /weather/:id */
export const deleteWeatherRecord = asyncHandler(async (req, res) => {
  const record = await Weather.findByIdAndDelete(req.params.id);
  if (!record) throw new ApiError(404, 'Weather record not found');
  ok(res, { message: 'Record deleted', id: req.params.id });
});

/** GET /weather/export/pdf — download full history as a formatted PDF report. */
export const exportWeatherPdf = asyncHandler(async (req, res) => {
  const { sessionId } = req.query;
  const filter = sessionId ? { userSessionId: sessionId } : {};
  const records = await Weather.find(filter).sort({ timestamp: -1 }).lean();

  res.setHeader('Content-Disposition', 'attachment; filename="weather-history.pdf"');
  res.setHeader('Content-Type', 'application/pdf');

  const doc = new PDFDocument({ margin: 40 });
  doc.pipe(res);

  doc.fontSize(18).text('Weather Search History Report', { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('gray').text(`Generated ${new Date().toISOString()} — ${records.length} record(s)`);
  doc.moveDown();

  records.forEach((r, idx) => {
    doc
      .fillColor('black')
      .fontSize(13)
      .text(`${idx + 1}. ${r.displayName || r.location}${r.country ? ` (${r.country})` : ''}`);
    doc
      .fontSize(10)
      .fillColor('#333')
      .text(
        `Coordinates: ${r.latitude.toFixed(4)}, ${r.longitude.toFixed(4)}  |  Temp: ${r.currentWeather?.temp ?? '—'}°C  |  Condition: ${
          r.currentWeather?.condition ?? '—'
        }`
      )
      .text(
        `Humidity: ${r.currentWeather?.humidity ?? '—'}%  |  Wind: ${r.currentWeather?.windSpeed ?? '—'} m/s  |  Pressure: ${
          r.currentWeather?.pressure ?? '—'
        } hPa`
      )
      .text(`Favorite: ${r.isFavorite ? 'Yes' : 'No'}  |  Recorded: ${new Date(r.timestamp).toISOString()}`);
    doc.moveDown(0.7);
  });

  doc.end();
});

/** GET /weather/export/xml */
export const exportWeatherXml = asyncHandler(async (req, res) => {
  const { sessionId } = req.query;
  const filter = sessionId ? { userSessionId: sessionId } : {};
  const records = await Weather.find(filter).sort({ timestamp: -1 }).lean();

  res.setHeader('Content-Disposition', 'attachment; filename="weather-history.xml"');
  res.setHeader('Content-Type', 'application/xml');
  res.send(buildXmlExport(records));
});

/** GET /weather/export/markdown */
export const exportWeatherMarkdown = asyncHandler(async (req, res) => {
  const { sessionId } = req.query;
  const filter = sessionId ? { userSessionId: sessionId } : {};
  const records = await Weather.find(filter).sort({ timestamp: -1 }).lean();

  res.setHeader('Content-Disposition', 'attachment; filename="weather-history.md"');
  res.setHeader('Content-Type', 'text/markdown');
  res.send(buildMarkdownExport(records));
});

/**
 * GET /weather/history-range
 * Backs the "Date-Range Query" panel: returns previously-saved records for a
 * location whose timestamps fall within [startDate, endDate]. (Historical
 * weather reconstruction beyond what has actually been searched/saved would
 * require a paid third-party archive API, so this reads from what the app
 * itself has already recorded.)
 */
export const getWeatherHistoryRange = asyncHandler(async (req, res) => {
  const { location, startDate, endDate, sessionId } = req.query;

  if (!startDate || !endDate) {
    throw new ApiError(400, 'Both startDate and endDate are required (YYYY-MM-DD)');
  }

  const filter = {
    timestamp: { $gte: new Date(startDate), $lte: new Date(`${endDate}T23:59:59.999Z`) },
  };
  if (location) filter.location = { $regex: location, $options: 'i' };
  if (sessionId) filter.userSessionId = sessionId;

  const records = await Weather.find(filter).sort({ timestamp: 1 });
  ok(res, records, { total: records.length });
});

/**
 * POST /weather/:id/advice
 * Generates short clothing/activity advice from a stored record's current
 * weather snapshot (rule-based by default, or a real LLM call when
 * ANTHROPIC_API_KEY is configured — see services/advisorService.js).
 */
export const getWeatherAdvice = asyncHandler(async (req, res) => {
  const record = await Weather.findById(req.params.id);
  if (!record) throw new ApiError(404, 'Weather record not found');

  const result = await generateWeatherAdvice(record.currentWeather, record.displayName || record.location);
  ok(res, result);
});

export const exportWeatherJson = asyncHandler(async (req, res) => {
  const { sessionId } = req.query;
  const filter = sessionId ? { userSessionId: sessionId } : {};
  const records = await Weather.find(filter).sort({ timestamp: -1 });

  res.setHeader('Content-Disposition', 'attachment; filename="weather-history.json"');
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(records, null, 2));
});

/** GET /weather/export/csv — download full history as CSV. */
export const exportWeatherCsv = asyncHandler(async (req, res) => {
  const { sessionId } = req.query;
  const filter = sessionId ? { userSessionId: sessionId } : {};
  const records = await Weather.find(filter).sort({ timestamp: -1 }).lean();

  const fields = [
    'location',
    'displayName',
    'country',
    'latitude',
    'longitude',
    'searchType',
    'currentWeather.temp',
    'currentWeather.condition',
    'currentWeather.humidity',
    'currentWeather.windSpeed',
    'currentWeather.pressure',
    'isFavorite',
    'timestamp',
  ];
  const parser = new CsvParser({ fields });
  const csv = parser.parse(records);

  res.setHeader('Content-Disposition', 'attachment; filename="weather-history.csv"');
  res.setHeader('Content-Type', 'text/csv');
  res.send(csv);
});
