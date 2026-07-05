import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { getWeatherIcon, getBackgroundGradient } from '../../utils/weatherTheme.js';
import { getWeatherEmoji } from '../../utils/weatherEmoji.js';
import { formatLocalDateTime, capitalize } from '../../utils/formatters.js';
import { useUnits } from '../../context/UnitsContext.jsx';
import FavoriteButton from '../common/FavoriteButton.jsx';

const CurrentWeatherCard = ({ record, isFavorite, onToggleFavorite }) => {
  const { displayName, location, country, currentWeather } = record;
  const { displayTemp, unitSymbol } = useUnits();
  const Icon = getWeatherIcon(currentWeather.condition, currentWeather.icon);
  const emoji = getWeatherEmoji(currentWeather.icon);
  const gradient = getBackgroundGradient(currentWeather.condition, currentWeather.icon);
  const isNight = currentWeather.icon?.endsWith('n');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 text-white shadow-panel sm:p-8`}
    >
      <div className="absolute inset-0 bg-grid-lines bg-grid opacity-20" />
      <div className="absolute -right-10 -top-10 opacity-15">
        <Icon size={220} strokeWidth={1} className="animate-float-slow" />
      </div>

      <div className="relative flex items-start justify-between">
        <div>
          <p className="eyebrow flex items-center gap-1.5 text-white/70">
            <MapPin size={12} /> Current Metrics
          </p>
          <h2 className="mt-1.5 font-display text-2xl font-semibold sm:text-3xl">
            {displayName || location}
            {country ? <span className="ml-2 text-base font-normal text-white/70">{country}</span> : null}
          </h2>
          <p className="mt-0.5 text-xs text-white/60">Live Geocoded Coordinates Report</p>
        </div>
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onToggleFavorite}
          className={`${isNight ? 'bg-white/10' : 'bg-black/10'} border-white/30 text-white`}
        />
      </div>

      <div className="relative mt-8 flex flex-wrap items-end gap-6">
        <div className="flex items-center gap-4">
          <span className="text-6xl leading-none drop-shadow-sm sm:text-7xl">{emoji}</span>
          <div>
            <p className="data-figure text-6xl font-semibold leading-none sm:text-7xl">
              {displayTemp(currentWeather.temp)}
              <span className="align-top text-3xl">{unitSymbol}</span>
            </p>
            <p className="mt-1 text-sm text-white/80">{capitalize(currentWeather.description)}</p>
          </div>
        </div>

        <p className="mb-1 flex items-center gap-1.5 text-xs text-white/50">
          {formatLocalDateTime(currentWeather.timezoneOffset)}
        </p>
      </div>

      <div className="relative mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <p className="text-[11px] uppercase tracking-wide text-white/60">Wind Speed</p>
          <p className="data-figure mt-0.5 text-lg font-semibold">{currentWeather.windSpeed} m/s</p>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <p className="text-[11px] uppercase tracking-wide text-white/60">Humidity</p>
          <p className="data-figure mt-0.5 text-lg font-semibold">{currentWeather.humidity}%</p>
        </div>
        <div className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
          <p className="text-[11px] uppercase tracking-wide text-white/60">Apparent Feels</p>
          <p className="data-figure mt-0.5 text-lg font-semibold">
            {displayTemp(currentWeather.feelsLike)}
            {unitSymbol}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CurrentWeatherCard;
