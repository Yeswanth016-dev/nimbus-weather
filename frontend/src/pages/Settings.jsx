import { useEffect, useState } from 'react';
import { Thermometer, MoonStar, Database, Wrench } from 'lucide-react';
import { useTheme } from '../context/ThemeContext.jsx';
import { useUnits } from '../context/UnitsContext.jsx';
import ExportPanel from '../components/weather/ExportPanel.jsx';
import api from '../services/api.js';

const SettingsRow = ({ icon: Icon, title, description, children }) => (
  <div className="flex flex-col gap-3 border-b border-black/5 py-5 last:border-0 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-black/10 text-atmosphere-500 dark:border-white/10 dark:text-mist-200/60">
        <Icon size={17} />
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-0.5 text-xs text-atmosphere-500 dark:text-mist-200/50">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const SegmentedToggle = ({ options, value, onChange }) => (
  <div className="flex shrink-0 items-center rounded-full border border-black/10 p-1 dark:border-white/10">
    {options.map((opt) => (
      <button
        key={opt.value}
        onClick={() => onChange(opt.value)}
        className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition ${
          value === opt.value
            ? 'bg-atmosphere-900 text-white dark:bg-amber-400 dark:text-atmosphere-950'
            : 'text-atmosphere-600 dark:text-mist-200/70'
        }`}
      >
        {opt.icon && <opt.icon size={13} />}
        {opt.label}
      </button>
    ))}
  </div>
);

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { unit, toggleUnit } = useUnits();
  const [dbStatus, setDbStatus] = useState('checking');

  useEffect(() => {
    let cancelled = false;
    api
      .get('/health')
      .then(({ data }) => {
        if (!cancelled) setDbStatus(data?.database?.status || 'unknown');
      })
      .catch(() => {
        if (!cancelled) setDbStatus('unreachable');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const statusColor =
    dbStatus === 'connected' ? 'text-emerald-500' : dbStatus === 'checking' ? 'text-amber-400' : 'text-coral-400';

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-2 flex items-center gap-2">
        <Wrench size={18} className="text-atmosphere-500 dark:text-mist-200/60" />
        <h2 className="font-display text-xl font-semibold">System Configurations</h2>
      </div>
      <p className="mb-5 text-sm text-atmosphere-500 dark:text-mist-200/50">
        Configure unit preferences, visual theme, and check backend connectivity.
      </p>

      <div className="panel px-5">
        <SettingsRow icon={Thermometer} title="Temperature Scale" description="Convert forecast values between Celsius and Fahrenheit.">
          <SegmentedToggle
            value={unit}
            onChange={(v) => v !== unit && toggleUnit()}
            options={[
              { value: 'metric', label: '°C' },
              { value: 'imperial', label: '°F' },
            ]}
          />
        </SettingsRow>

        <SettingsRow icon={MoonStar} title="Visual Display Mode" description="Toggle the app's layout between dark and light environments.">
          <SegmentedToggle
            value={theme}
            onChange={(v) => v !== theme && toggleTheme()}
            options={[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
            ]}
          />
        </SettingsRow>

        <SettingsRow icon={Database} title="Connected Database Backend" description="Live connectivity check against the Express API and MongoDB.">
          <span className={`flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide dark:border-white/10 ${statusColor}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${statusColor.replace('text-', 'bg-')}`} />
            {dbStatus === 'checking' ? 'Checking…' : dbStatus}
          </span>
        </SettingsRow>
      </div>

      <div className="mt-6">
        <ExportPanel />
      </div>
    </div>
  );
};

export default Settings;
