import api from './api.js';

/** Creates a new weather search (backend resolves location + fetches live data). */
export const searchWeather = async ({ location, latitude, longitude, sessionId, isCurrentLocation }) => {
  const { data } = await api.post('/weather', {
    location,
    latitude,
    longitude,
    sessionId,
    isCurrentLocation,
  });
  return data.data;
};

/** Fetches search history, optionally scoped to a session or favorites only. */
export const getHistory = async ({ sessionId, favoritesOnly, page = 1, limit = 20 } = {}) => {
  const { data } = await api.get('/weather', {
    params: { sessionId, favoritesOnly, page, limit },
  });
  return data;
};

export const getWeatherRecord = async (id) => {
  const { data } = await api.get(`/weather/${id}`);
  return data.data;
};

export const toggleFavorite = async (id, isFavorite) => {
  const { data } = await api.put(`/weather/${id}`, { isFavorite });
  return data.data;
};

export const refreshRecord = async (id) => {
  const { data } = await api.put(`/weather/${id}`, { refresh: true });
  return data.data;
};

export const deleteRecord = async (id) => {
  const { data } = await api.delete(`/weather/${id}`);
  return data.data;
};

export const getAdvice = async (id) => {
  const { data } = await api.post(`/weather/${id}/advice`);
  return data.data;
};

export const getHistoryRange = async ({ location, startDate, endDate, sessionId }) => {
  const { data } = await api.get('/weather/history-range', {
    params: { location, startDate, endDate, sessionId },
  });
  return data;
};

export const exportUrl = (format, sessionId) => {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const query = sessionId ? `?sessionId=${encodeURIComponent(sessionId)}` : '';
  return `${base}/weather/export/${format}${query}`;
};
