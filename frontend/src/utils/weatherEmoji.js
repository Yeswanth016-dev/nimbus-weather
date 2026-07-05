/**
 * Maps an OpenWeatherMap icon code (e.g. "10d") to a representative emoji.
 * Using real emoji (rather than flat monochrome icons) for weather condition
 * display gives the app the same colorful, at-a-glance readability as the
 * reference design.
 */
const EMOJI_MAP = {
  '01d': '☀️',
  '01n': '🌙',
  '02d': '⛅',
  '02n': '☁️',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '🌧️',
  '09n': '🌧️',
  '10d': '🌦️',
  '10n': '🌧️',
  '11d': '⛈️',
  '11n': '⛈️',
  '13d': '❄️',
  '13n': '❄️',
  '50d': '🌫️',
  '50n': '🌫️',
};

export const getWeatherEmoji = (icon) => EMOJI_MAP[icon] || '🌤️';
