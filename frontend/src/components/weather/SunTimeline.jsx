import { Sunrise, Sunset } from 'lucide-react';
import { formatLocalTime } from '../../utils/formatters.js';

const SunTimeline = ({ currentWeather }) => {
  const { sunrise, sunset, timezoneOffset } = currentWeather;
  const nowUnix = Date.now() / 1000;
  const progress = Math.min(100, Math.max(0, ((nowUnix - sunrise) / (sunset - sunrise)) * 100));

  return (
    <div className="panel p-4">
      <p className="eyebrow mb-4 px-1">Sun</p>
      <div className="flex items-center justify-between px-1 text-sm">
        <div className="flex items-center gap-2 text-amber-500">
          <Sunrise size={18} />
          <span className="data-figure font-medium">{formatLocalTime(sunrise, timezoneOffset)}</span>
        </div>
        <div className="flex items-center gap-2 text-coral-400">
          <span className="data-figure font-medium">{formatLocalTime(sunset, timezoneOffset)}</span>
          <Sunset size={18} />
        </div>
      </div>
      <div className="relative mt-3 h-1.5 rounded-full bg-atmosphere-200/50 dark:bg-atmosphere-700">
        <div
          className="absolute h-1.5 rounded-full bg-gradient-to-r from-amber-400 to-coral-400"
          style={{ width: `${progress}%` }}
        />
        <div
          className="absolute -top-1.5 h-4 w-4 rounded-full border-2 border-white bg-amber-400 shadow dark:border-atmosphere-900"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>
    </div>
  );
};

export default SunTimeline;
