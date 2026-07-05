import { AlertOctagon } from 'lucide-react';

const WeatherAlerts = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {alerts.map((alert, idx) => (
        <div
          key={`${alert.event}-${idx}`}
          className="flex items-start gap-3 rounded-2xl border border-coral-400/40 bg-coral-400/10 p-4"
        >
          <AlertOctagon size={20} className="mt-0.5 shrink-0 text-coral-400" />
          <div>
            <p className="font-semibold text-coral-400">{alert.event}</p>
            <p className="mt-1 text-sm text-atmosphere-700 dark:text-mist-100/80">{alert.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeatherAlerts;
