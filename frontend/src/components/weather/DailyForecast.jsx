import { formatDayLabel } from '../../utils/formatters.js';
import { getWeatherEmoji } from '../../utils/weatherEmoji.js';
import { useUnits } from '../../context/UnitsContext.jsx';
import { Droplet } from 'lucide-react';

const DailyForecast = ({ forecast }) => {
  const { displayTemp, unitSymbol } = useUnits();
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="panel p-4">
      <p className="eyebrow mb-3 px-1">5-Day Forecast</p>
      <div className="flex flex-col gap-2">
        {forecast.map((day, idx) => {
          const emoji = getWeatherEmoji(day.icon);
          const isToday = idx === 0;
          return (
            <div
              key={day.date}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 transition ${
                isToday
                  ? 'border-cyan-400/50 bg-cyan-400/5'
                  : 'border-black/5 dark:border-white/5'
              }`}
            >
              <div className="flex min-w-[92px] items-baseline gap-2">
                <span className={`text-sm font-semibold ${isToday ? 'text-cyan-500' : ''}`}>
                  {isToday ? 'Today' : formatDayLabel(day.date)}
                </span>
                <span className="data-figure text-xs text-atmosphere-400 dark:text-mist-200/40">
                  {day.date.slice(5)}
                </span>
              </div>
              <span className="text-2xl leading-none">{emoji}</span>
              <div className="flex items-center gap-2">
                <span className="data-figure text-sm font-semibold">
                  {displayTemp(day.tempMax)}
                  {unitSymbol}
                </span>
                <span className="data-figure text-sm text-atmosphere-400 dark:text-mist-200/40">
                  {displayTemp(day.tempMin)}
                  {unitSymbol}
                </span>
              </div>
              {day.pop > 0 ? (
                <span className="flex items-center gap-1 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2 py-0.5 text-[11px] font-medium text-cyan-500">
                  <Droplet size={10} /> {day.pop}%
                </span>
              ) : (
                <span className="w-[52px]" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DailyForecast;
