import { useState, useCallback, useEffect } from 'react';
import { Search, Archive } from 'lucide-react';
import DateRangeQuery from '../components/weather/DateRangeQuery.jsx';
import FavoritesPanel from '../components/weather/FavoritesPanel.jsx';
import { getHistory, toggleFavorite, deleteRecord, refreshRecord, exportUrl } from '../services/weatherService.js';
import { getSessionId } from '../utils/session.js';

const HistoryLogs = ({ onSelectRecord }) => {
  const [subTab, setSubTab] = useState('query'); // 'query' | 'archives'
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const sessionId = getSessionId();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHistory({ sessionId, favoritesOnly: true, limit: 50 });
      setRecords(res.data);
      setCount(res.total ?? res.data.length);
    } catch {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    if (subTab === 'archives') load();
  }, [subTab, load]);

  const handleToggleFavorite = async (id, next) => {
    setRecords((prev) => (next ? prev : prev.filter((r) => r._id !== id)));
    await toggleFavorite(id, next);
  };

  const handleDelete = async (id) => {
    setRecords((prev) => prev.filter((r) => r._id !== id));
    await deleteRecord(id);
  };

  const handleRefresh = async (id) => {
    const updated = await refreshRecord(id);
    setRecords((prev) => prev.map((r) => (r._id === id ? updated : r)));
  };

  const handleExport = (format) => window.open(exportUrl(format, sessionId), '_blank');

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-5 flex items-center gap-2">
        <h2 className="font-display text-xl font-semibold">Climate Intelligence Reports</h2>
      </div>
      <p className="mb-5 text-sm text-atmosphere-500 dark:text-mist-200/50">
        Compare date ranges, discover trends, and manage your saved observations.
      </p>

      <div className="mb-5 inline-flex rounded-full border border-black/10 p-1 dark:border-white/10">
        <button
          onClick={() => setSubTab('query')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
            subTab === 'query'
              ? 'bg-atmosphere-900 text-white dark:bg-amber-400 dark:text-atmosphere-950'
              : 'text-atmosphere-600 dark:text-mist-200/70'
          }`}
        >
          <Search size={14} /> Date-Range Query
        </button>
        <button
          onClick={() => setSubTab('archives')}
          className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition ${
            subTab === 'archives'
              ? 'bg-atmosphere-900 text-white dark:bg-amber-400 dark:text-atmosphere-950'
              : 'text-atmosphere-600 dark:text-mist-200/70'
          }`}
        >
          <Archive size={14} /> Saved Archives ({count})
        </button>
      </div>

      {subTab === 'query' ? (
        <DateRangeQuery />
      ) : (
        <FavoritesPanel
          records={records}
          loading={loading}
          onSelect={onSelectRecord}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />
      )}
    </div>
  );
};

export default HistoryLogs;
