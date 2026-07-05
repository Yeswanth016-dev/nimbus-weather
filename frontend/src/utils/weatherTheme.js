import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudFog,
  Wind,
} from 'lucide-react';

/**
 * Determines whether "now" falls between sunrise and sunset (both Unix
 * seconds, UTC) — a fallback for when an OpenWeatherMap icon code isn't
 * available to infer day/night from directly.
 */
export const isDaytime = (sunrise, sunset) => {
  if (!sunrise || !sunset) return true;
  const nowUnix = Date.now() / 1000;
  return nowUnix >= sunrise && nowUnix <= sunset;
};

const ICON_MAP = {
  Clear: { day: Sun, night: Moon },
  Clouds: { day: CloudSun, night: CloudMoon, dense: Cloud },
  Rain: { day: CloudRain, night: CloudRain },
  Drizzle: { day: CloudDrizzle, night: CloudDrizzle },
  Thunderstorm: { day: CloudLightning, night: CloudLightning },
  Snow: { day: CloudSnow, night: CloudSnow },
  Mist: { day: CloudFog, night: CloudFog },
  Fog: { day: CloudFog, night: CloudFog },
  Haze: { day: CloudFog, night: CloudFog },
  Smoke: { day: CloudFog, night: CloudFog },
  Dust: { day: Wind, night: Wind },
  Squall: { day: Wind, night: Wind },
  Tornado: { day: Wind, night: Wind },
};

/**
 * @param {string} condition - OpenWeatherMap "main" weather category (e.g. "Rain")
 * @param {string} icon - OpenWeatherMap icon code (e.g. "10d") — the trailing
 *   d/n tells us day vs night without needing sunrise/sunset math.
 */
export const getWeatherIcon = (condition, icon = '') => {
  const entry = ICON_MAP[condition] || ICON_MAP.Clouds;
  const isNight = icon.endsWith('n');
  if (condition === 'Clouds' && icon === '04d') return entry.dense || Cloud;
  return isNight ? entry.night : entry.day;
};

/**
 * Dynamic background gradient classes keyed by condition + day/night,
 * used on the hero current-weather panel.
 */
export const getBackgroundGradient = (condition, icon = '') => {
  const isNight = icon.endsWith('n');

  const gradients = {
    Clear: isNight
      ? 'from-[#0B1220] via-[#141F3A] to-[#1A2740]'
      : 'from-[#3FA9BB] via-[#5EC8D8] to-[#F2A93B]',
    Clouds: isNight
      ? 'from-[#0B1220] via-[#1A2740] to-[#26365A]'
      : 'from-[#5B7A9E] via-[#7C9BB8] to-[#B8CCE0]',
    Rain: 'from-[#1A2740] via-[#26365A] to-[#3A4E70]',
    Drizzle: 'from-[#2A3B5A] via-[#3A4E70] to-[#5B7A9E]',
    Thunderstorm: 'from-[#0B1220] via-[#1A1F3A] to-[#2A2547]',
    Snow: isNight
      ? 'from-[#1A2740] via-[#26365A] to-[#3F5372]'
      : 'from-[#8FA8C7] via-[#B8CCE0] to-[#EEF2F8]',
    Mist: 'from-[#3A4A5E] via-[#5B6B7E] to-[#8290A0]',
    Fog: 'from-[#3A4A5E] via-[#5B6B7E] to-[#8290A0]',
    Haze: 'from-[#5B6B4E] via-[#8B9070] to-[#B8AE8A]',
  };

  return gradients[condition] || gradients.Clouds;
};
