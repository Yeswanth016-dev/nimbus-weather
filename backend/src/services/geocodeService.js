import axios from 'axios';
import { ApiError } from '../utils/apiResponse.js';

const GEO_BASE = 'https://api.openweathermap.org/geo/1.0';

const getKey = () => {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || key === 'your_openweathermap_api_key_here') {
    throw new ApiError(
      500,
      'Server is missing OPENWEATHER_API_KEY. Add it to backend/.env to enable weather lookups.'
    );
  }
  return key;
};

/**
 * Resolves a free-text query (city, town, village, landmark, "city,country")
 * into coordinates + a friendly display name.
 */
const resolveByName = async (query) => {
  const { data } = await axios.get(`${GEO_BASE}/direct`, {
    params: { q: query, limit: 1, appid: getKey() },
  });

  if (!data || data.length === 0) {
    throw new ApiError(404, `We couldn't find a location matching "${query}". Check the spelling and try again.`);
  }

  const place = data[0];
  return {
    latitude: place.lat,
    longitude: place.lon,
    displayName: [place.name, place.state, place.country].filter(Boolean).join(', '),
    country: place.country,
  };
};

/**
 * Resolves a ZIP/postal code, optionally scoped to a country (defaults to US
 * format "zip,countryCode" as required by the OpenWeatherMap ZIP endpoint).
 */
const resolveByZip = async (zipQuery) => {
  const query = zipQuery.includes(',') ? zipQuery : `${zipQuery},us`;
  try {
    const { data } = await axios.get(`${GEO_BASE}/zip`, {
      params: { zip: query, appid: getKey() },
    });
    return {
      latitude: data.lat,
      longitude: data.lon,
      displayName: [data.name, data.country].filter(Boolean).join(', '),
      country: data.country,
    };
  } catch (err) {
    throw new ApiError(404, `We couldn't find a location for postal code "${zipQuery}".`);
  }
};

/** Reverse geocodes coordinates into a friendly display name. */
const resolveByCoordinates = async (lat, lon) => {
  const { data } = await axios.get(`${GEO_BASE}/reverse`, {
    params: { lat, lon, limit: 1, appid: getKey() },
  });

  const place = data && data[0];
  return {
    latitude: lat,
    longitude: lon,
    displayName: place ? [place.name, place.state, place.country].filter(Boolean).join(', ') : `${lat.toFixed(2)}, ${lon.toFixed(2)}`,
    country: place?.country,
  };
};

const ZIP_REGEX = /^\d{4,10}(,[a-zA-Z]{2})?$/;

/**
 * Single entry point used by the controller: figures out what kind of
 * query the user typed (coords / zip / free text) and resolves it.
 */
export const resolveLocation = async ({ location, latitude, longitude }) => {
  if (latitude !== undefined && longitude !== undefined) {
    const resolved = await resolveByCoordinates(Number(latitude), Number(longitude));
    return { ...resolved, searchType: 'coordinates' };
  }

  const trimmed = location.trim();

  // "lat,lon" typed directly into the search bar
  const coordMatch = trimmed.match(/^(-?\d+(\.\d+)?)\s*,\s*(-?\d+(\.\d+)?)$/);
  if (coordMatch) {
    const lat = Number(coordMatch[1]);
    const lon = Number(coordMatch[3]);
    const resolved = await resolveByCoordinates(lat, lon);
    return { ...resolved, searchType: 'coordinates' };
  }

  if (ZIP_REGEX.test(trimmed)) {
    const resolved = await resolveByZip(trimmed);
    return { ...resolved, searchType: 'zip' };
  }

  const resolved = await resolveByName(trimmed);
  return { ...resolved, searchType: 'city' };
};
