import { useUnits } from '../../context/UnitsContext.jsx';
import { getWeatherEmoji } from '../../utils/weatherEmoji.js';
import { CloudRain } from 'lucide-react';

const HourlyForecast = ({ hourly }) => {
  const { displayTemp, unitSymbol } = useUnits();
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="panel p-4">
      <p className="eyebrow mb-3 px-1">Today &middot; Hourly</p>
      <div className="scrollbar-thin flex gap-3 overflow-x-auto pb-1">
        {hourly.map((hour) => {
          const emoji = getWeatherEmoji(hour.icon);
          return (
            <div
              key={hour.time}
              className="flex min-w-[76px] flex-col items-center gap-2 rounded-xl border border-black/5 px-3 py-3 dark:border-white/5"
            >
              <span className="text-xs font-medium text-atmosphere-500 dark:text-mist-200/60">{hour.time}</span>
              <span className="text-2xl leading-none">{emoji}</span>
              <span className="data-figure text-sm font-semibold">{displayTemp(hour.temp)}{unitSymbol}</span>
              {hour.pop > 0 && (
                <span className="flex items-center gap-0.5 text-[11px] text-cyan-500">
                  <CloudRain size={11} /> {hour.pop}%
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
