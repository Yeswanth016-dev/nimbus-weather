import { Gauge, Eye, Sun, Wind, Droplets, Compass } from 'lucide-react';
import { degreesToCompass, metersToKm, uvLabel } from '../../utils/formatters.js';

const StatTile = ({ icon: Icon, label, value, sub, badgeClass }) => (
  <div className="panel flex flex-col gap-2.5 p-4">
    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${badgeClass}`}>
      <Icon size={15} />
    </div>
    <div>
      <p className="eyebrow">{label}</p>
      <p className="data-figure mt-0.5 text-xl font-semibold">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-atmosphere-500 dark:text-mist-200/50">{sub}</p>}
    </div>
  </div>
);

const WeatherStatGrid = ({ currentWeather }) => {
  const uv = uvLabel(currentWeather.uvIndex);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      <StatTile
        icon={Wind}
        label="Wind"
        value={`${currentWeather.windSpeed} m/s`}
        sub={degreesToCompass(currentWeather.windDeg)}
        badgeClass="bg-cyan-400/15 text-cyan-500"
      />
      <StatTile
        icon={Droplets}
        label="Humidity"
        value={`${currentWeather.humidity}%`}
        badgeClass="bg-blue-400/15 text-blue-500"
      />
      <StatTile
        icon={Gauge}
        label="Pressure"
        value={`${currentWeather.pressure}`}
        sub="hPa"
        badgeClass="bg-violet-400/15 text-violet-500"
      />
      <StatTile
        icon={Eye}
        label="Visibility"
        value={`${metersToKm(currentWeather.visibility)} km`}
        badgeClass="bg-slate-400/15 text-slate-500"
      />
      <StatTile
        icon={Sun}
        label="UV Index"
        value={currentWeather.uvIndex ?? '—'}
        sub={<span className={uv.color}>{uv.text}</span>}
        badgeClass="bg-amber-400/15 text-amber-500"
      />
      <StatTile
        icon={Compass}
        label="Wind Dir."
        value={`${currentWeather.windDeg ?? '—'}°`}
        badgeClass="bg-emerald-400/15 text-emerald-500"
      />
    </div>
  );
};

export default WeatherStatGrid;
