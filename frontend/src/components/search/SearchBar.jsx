import { useState } from 'react';
import { Search, LocateFixed, Loader2 } from 'lucide-react';

const SearchBar = ({ onSearch, onUseLocation, locating }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="panel flex flex-col gap-2 p-2 sm:flex-row sm:items-center">
      <div className="flex flex-1 items-center gap-2 px-3 py-2">
        <Search size={18} className="shrink-0 text-atmosphere-500 dark:text-mist-200/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="City, town, ZIP/postal code, landmark, or lat,lon"
          className="w-full bg-transparent text-sm outline-none placeholder:text-atmosphere-400 dark:placeholder:text-mist-200/40"
          aria-label="Search for a location"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onUseLocation}
          disabled={locating}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-black/10 px-4 py-2.5 text-sm font-medium text-atmosphere-700 transition hover:border-cyan-400/60 hover:text-cyan-600 disabled:opacity-60 dark:border-white/10 dark:text-mist-100 sm:flex-none"
        >
          {locating ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
          <span className="whitespace-nowrap">Use My Location</span>
        </button>
        <button
          type="submit"
          className="flex-1 rounded-xl bg-atmosphere-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-atmosphere-700 dark:bg-amber-400 dark:text-atmosphere-950 dark:hover:bg-amber-500 sm:flex-none"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default SearchBar;
