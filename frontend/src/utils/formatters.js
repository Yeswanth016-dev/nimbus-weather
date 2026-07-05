/** Formats a Unix (seconds) timestamp + tz offset (seconds) into a local time string. */
export const formatLocalTime = (unixSeconds, timezoneOffsetSeconds = 0) => {
  const localMs = (unixSeconds + timezoneOffsetSeconds) * 1000;
  const date = new Date(localMs);
  return date.toUTCString().slice(17, 22); // "HH:MM"
};

/** Formats a Unix (seconds) timestamp + tz offset into a local weekday/date string. */
export const formatLocalDateTime = (timezoneOffsetSeconds = 0) => {
  const nowMs = Date.now() + timezoneOffsetSeconds * 1000;
  const date = new Date(nowMs);
  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'UTC',
  });
};

export const formatDayLabel = (isoDateStr) => {
  const date = new Date(`${isoDateStr}T00:00:00Z`);
  return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
};

export const degreesToCompass = (deg) => {
  if (deg === undefined || deg === null) return '—';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return directions[Math.round(deg / 22.5) % 16];
};

export const metersToKm = (meters) => (meters === undefined ? '—' : (meters / 1000).toFixed(1));

export const aqiLabel = (aqi) => {
  const labels = {
    1: { text: 'Good', color: 'text-emerald-500' },
    2: { text: 'Fair', color: 'text-cyan-500' },
    3: { text: 'Moderate', color: 'text-amber-500' },
    4: { text: 'Poor', color: 'text-coral-400' },
    5: { text: 'Very Poor', color: 'text-red-600' },
  };
  return labels[aqi] || { text: 'Unknown', color: 'text-atmosphere-600' };
};

export const uvLabel = (uv) => {
  if (uv === null || uv === undefined) return { text: '—', color: 'text-atmosphere-600' };
  if (uv < 3) return { text: 'Low', color: 'text-emerald-500' };
  if (uv < 6) return { text: 'Moderate', color: 'text-amber-500' };
  if (uv < 8) return { text: 'High', color: 'text-coral-400' };
  if (uv < 11) return { text: 'Very High', color: 'text-red-500' };
  return { text: 'Extreme', color: 'text-red-700' };
};

export const capitalize = (str) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');
