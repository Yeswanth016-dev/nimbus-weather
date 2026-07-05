import { aqiLabel } from '../../utils/formatters.js';

const POLLUTANTS = [
  { key: 'pm2_5', label: 'PM2.5' },
  { key: 'pm10', label: 'PM10' },
  { key: 'o3', label: 'O₃' },
  { key: 'no2', label: 'NO₂' },
  { key: 'co', label: 'CO' },
];

const AirQualityCard = ({ airQuality }) => {
  if (!airQuality) return null;
  const { text, color } = aqiLabel(airQuality.aqi);

  return (
    <div className="panel p-4">
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="eyebrow">Air Quality Index</p>
        <span className={`text-sm font-semibold ${color}`}>{text}</span>
      </div>
      <div className="grid grid-cols-5 gap-2">
        {POLLUTANTS.map((p) => (
          <div key={p.key} className="rounded-lg border border-black/5 px-2 py-2.5 text-center dark:border-white/5">
            <p className="data-figure text-sm font-semibold">{Math.round(airQuality[p.key])}</p>
            <p className="mt-0.5 text-[10px] uppercase tracking-wide text-atmosphere-500 dark:text-mist-200/50">{p.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AirQualityCard;
