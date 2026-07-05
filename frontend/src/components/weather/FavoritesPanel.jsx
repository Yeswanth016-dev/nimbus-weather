import { Trash2, RefreshCw, Download, MapPin } from 'lucide-react';
import { getWeatherEmoji } from '../../utils/weatherEmoji.js';
import { useUnits } from '../../context/UnitsContext.jsx';
import FavoriteButton from '../common/FavoriteButton.jsx';

const FavoritesPanel = ({ records, loading, onSelect, onToggleFavorite, onDelete, onRefresh, onExport }) => {
  const { displayTemp, unitSymbol } = useUnits();

  return (
    <div className="panel p-4">
      <div className="mb-4 flex items-center justify-between px-1">
        <p className="eyebrow">Saved Locations</p>
        <div className="flex gap-2">
          <button
            onClick={() => onExport('json')}
            className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-atmosphere-600 hover:border-cyan-400/60 hover:text-cyan-600 dark:border-white/10 dark:text-mist-200/70"
          >
            <Download size={12} /> JSON
          </button>
          <button
            onClick={() => onExport('csv')}
            className="flex items-center gap-1.5 rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium text-atmosphere-600 hover:border-cyan-400/60 hover:text-cyan-600 dark:border-white/10 dark:text-mist-200/70"
          >
            <Download size={12} /> CSV
          </button>
        </div>
      </div>

      {loading && <p className="px-1 text-sm text-atmosphere-500 dark:text-mist-200/50">Loading…</p>}

      {!loading && records.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <MapPin size={28} className="text-atmosphere-300 dark:text-mist-200/30" />
          <p className="text-sm text-atmosphere-500 dark:text-mist-200/50">
            No favorites yet — star a location from the Forecast tab to save it here.
          </p>
        </div>
      )}

      <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
        {records.map((record) => {
          const emoji = getWeatherEmoji(record.currentWeather?.icon);
          return (
            <div key={record._id} className="flex items-center gap-3 py-3">
              <button onClick={() => onSelect(record)} className="flex flex-1 items-center gap-3 text-left">
                <span className="text-2xl leading-none">{emoji}</span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{record.displayName || record.location}</p>
                  <p className="text-xs text-atmosphere-500 dark:text-mist-200/50">
                    {displayTemp(record.currentWeather?.temp)}
                    {unitSymbol} &middot; {record.currentWeather?.condition}
                  </p>
                </div>
              </button>
              <button
                onClick={() => onRefresh(record._id)}
                aria-label="Refresh"
                className="flex h-8 w-8 items-center justify-center rounded-full text-atmosphere-400 hover:text-cyan-500"
              >
                <RefreshCw size={14} />
              </button>
              <FavoriteButton
                isFavorite={record.isFavorite}
                onToggle={() => onToggleFavorite(record._id, !record.isFavorite)}
              />
              <button
                onClick={() => onDelete(record._id)}
                aria-label="Delete"
                className="flex h-8 w-8 items-center justify-center rounded-full text-atmosphere-400 hover:text-coral-400"
              >
                <Trash2 size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesPanel;
