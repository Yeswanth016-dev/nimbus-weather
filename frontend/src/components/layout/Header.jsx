import { Gauge, CloudSun, Archive, Settings as SettingsIcon } from 'lucide-react';
import ThemeToggle from '../common/ThemeToggle.jsx';

const TABS = [
  { key: 'forecast', label: 'Forecast', icon: CloudSun },
  { key: 'history', label: 'History & Logs', icon: Archive },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
];

const Header = ({ view, onViewChange }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-mist-50/80 backdrop-blur-md dark:border-white/5 dark:bg-atmosphere-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-amber-400 text-atmosphere-950 shadow-glow">
            <Gauge size={19} strokeWidth={2.2} />
          </div>
          <div className="leading-tight">
            <p className="font-display text-lg font-semibold tracking-tight">Nimbus</p>
            <p className="eyebrow -mt-0.5">Live Weather Instrument</p>
          </div>
        </div>

        <nav className="hidden items-center rounded-full border border-black/10 p-1 dark:border-white/10 md:flex">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onViewChange(tab.key)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                view === tab.key
                  ? 'bg-atmosphere-900 text-white dark:bg-amber-400 dark:text-atmosphere-950'
                  : 'text-atmosphere-600 dark:text-mist-200/70'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </nav>

        <ThemeToggle />
      </div>

      {/* Mobile tab bar */}
      <div className="flex items-center justify-center gap-1 border-t border-black/5 py-2 dark:border-white/5 md:hidden">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onViewChange(tab.key)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium ${
              view === tab.key ? 'bg-atmosphere-900 text-white dark:bg-amber-400 dark:text-atmosphere-950' : 'text-atmosphere-600 dark:text-mist-200/70'
            }`}
          >
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};

export default Header;
