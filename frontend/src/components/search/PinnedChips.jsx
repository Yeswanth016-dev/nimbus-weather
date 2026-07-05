import { useEffect, useState, useCallback } from 'react';
import { Star, X } from 'lucide-react';
import { getHistory, toggleFavorite } from '../../services/weatherService.js';
import { getSessionId } from '../../utils/session.js';

const PinnedChips = ({ onSelect, refreshKey }) => {
  const [pinned, setPinned] = useState([]);
  const sessionId = getSessionId();

  const load = useCallback(async () => {
    try {
      const res = await getHistory({ sessionId, favoritesOnly: true, limit: 12 });
      setPinned(res.data);
    } catch {
      setPinned([]);
    }
  }, [sessionId]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  const handleRemove = async (e, id) => {
    e.stopPropagation();
    setPinned((prev) => prev.filter((p) => p._id !== id));
    await toggleFavorite(id, false);
  };

  if (pinned.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-1">
      <span className="flex items-center gap-1 text-xs font-semibold text-amber-500">
        <Star size={12} fill="currentColor" /> Pinned:
      </span>
      {pinned.map((p) => (
        <button
          key={p._id}
          onClick={() => onSelect(p)}
          className="flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium text-atmosphere-700 transition hover:border-amber-400 dark:text-mist-100"
        >
          {p.displayName || p.location}
          <span onClick={(e) => handleRemove(e, p._id)} className="text-atmosphere-400 hover:text-coral-400">
            <X size={11} />
          </span>
        </button>
      ))}
    </div>
  );
};

export default PinnedChips;
