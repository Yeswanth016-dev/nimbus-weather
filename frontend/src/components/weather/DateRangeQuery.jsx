import { useState } from 'react';
import { Search } from 'lucide-react';
import { getHistoryRange } from '../../services/weatherService.js';
import { getSessionId } from '../../utils/session.js';
import { useUnits } from '../../context/UnitsContext.jsx';

const toDateInput = (d) => d.toISOString().slice(0, 10);

const DateRangeQuery = () => {
  const today = new Date();
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(toDateInput(weekAgo));
  const [endDate, setEndDate] = useState(toDateInput(today));
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { displayTemp, unitSymbol } = useUnits();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await getHistoryRange({
        location: location.trim() || undefined,
        startDate,
        endDate,
        sessionId: getSessionId(),
      });
      setResults(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel p-5">
      <p className="font-display text-base font-semibold">Start Meteorological Search</p>
      <p className="mt-1 text-sm text-atmosphere-500 dark:text-mist-200/50">
        Provide a location and date range to compare temperatures you've already recorded during past searches.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <div>
          <label className="eyebrow mb-1.5 block">Target Location Query</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Zurich, 90210, 35.67,139.65, or Eiffel Tower (optional — leave blank for all)"
            className="w-full rounded-xl border border-black/10 bg-white/70 px-4 py-2.5 text-sm outline-none focus:border-cyan-400/60 dark:border-white/10 dark:bg-atmosphere-900/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="eyebrow mb-1.5 block">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-cyan-400/60 dark:border-white/10 dark:bg-atmosphere-900/50"
            />
          </div>
          <div>
            <label className="eyebrow mb-1.5 block">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-xl border border-black/10 bg-white/70 px-3 py-2.5 text-sm outline-none focus:border-cyan-400/60 dark:border-white/10 dark:bg-atmosphere-900/50"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-atmosphere-900 py-3 text-sm font-semibold text-white transition hover:bg-atmosphere-700 disabled:opacity-60 dark:bg-amber-400 dark:text-atmosphere-950 dark:hover:bg-amber-500"
        >
          <Search size={15} /> {loading ? 'Querying…' : 'Fetch Date-Range Records'}
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-coral-400">{error}</p>}

      {results && (
        <div className="mt-4">
          <p className="eyebrow mb-2">
            {results.length} record{results.length === 1 ? '' : 's'} found
          </p>
          {results.length === 0 ? (
            <p className="text-sm text-atmosphere-500 dark:text-mist-200/50">
              No saved searches in that range yet — search a location on the Forecast tab first, then it'll show up here.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
              {results.map((r) => (
                <div key={r._id} className="flex items-center justify-between py-2.5 text-sm">
                  <span>{r.displayName || r.location}</span>
                  <span className="data-figure text-atmosphere-500 dark:text-mist-200/60">
                    {displayTemp(r.currentWeather?.temp)}
                    {unitSymbol} &middot; {new Date(r.timestamp).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DateRangeQuery;
