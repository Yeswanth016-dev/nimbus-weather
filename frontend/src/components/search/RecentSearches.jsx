import { Clock, X } from 'lucide-react';

const RecentSearches = ({ items, onSelect, onClear }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-1">
      <span className="flex items-center gap-1 text-xs font-medium text-atmosphere-500 dark:text-mist-200/50">
        <Clock size={13} /> Recent:
      </span>
      {items.map((item) => (
        <button
          key={`${item.label}-${item.latitude}-${item.longitude}`}
          onClick={() => onSelect(item)}
          className="rounded-full border border-black/10 bg-white/60 px-3 py-1 text-xs font-medium text-atmosphere-700 transition hover:border-cyan-400/60 hover:text-cyan-600 dark:border-white/10 dark:bg-atmosphere-800/50 dark:text-mist-100"
        >
          {item.label}
        </button>
      ))}
      <button
        onClick={onClear}
        aria-label="Clear recent searches"
        className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-atmosphere-400 hover:text-coral-400 dark:text-mist-200/40"
      >
        <X size={12} /> clear
      </button>
    </div>
  );
};

export default RecentSearches;
