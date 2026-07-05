import axios from 'axios';

const BASE = 'https://api.openweathermap.org/data/2.5';
const ONECALL_BASE = 'https://api.openweathermap.org/data/3.0';

const key = () => process.env.OPENWEATHER_API_KEY;

/** Current conditions for a coordinate pair. */
export const getCurrentWeather = async (lat, lon, units = 'metric') => {
  const { data } = await axios.get(`${BASE}/weather`, {
    params: { lat, lon, units, appid: key() },
  });
  return data;
};

/** 5 day / 3 hour forecast — used to build both hourly-today and 5-day cards. */
export const getForecast = async (lat, lon, units = 'metric') => {
  const { data } = await axios.get(`${BASE}/forecast`, {
    params: { lat, lon, units, appid: key() },
  });
  return data;
};

/** Air Quality Index + pollutant breakdown. */
export const getAirQuality = async (lat, lon) => {
  try {
    const { data } = await axios.get(`${BASE}/air_pollution`, {
      params: { lat, lon, appid: key() },
    });
    return data?.list?.[0] ?? null;
  } catch {
    return null;
  }
};

/**
 * One Call 3.0 gives UV index + government weather alerts. It requires a
 * separate (free-tier) subscription on OpenWeatherMap; if the account
 * doesn't have it enabled we degrade gracefully instead of failing the
 * whole request.
 */
export const getUvAndAlerts = async (lat, lon, units = 'metric') => {
  try {
    const { data } = await axios.get(`${ONECALL_BASE}/onecall`, {
      params: {
        lat,
        lon,
        units,
        exclude: 'minutely',
        appid: key(),
      },
    });
    return {
      uvIndex: data?.current?.uvi ?? null,
      alerts: (data?.alerts ?? []).map((a) => ({
        event: a.event,
        description: a.description,
        start: a.start,
        end: a.end,
      })),
    };
  } catch {
    return { uvIndex: null, alerts: [] };
  }
};
