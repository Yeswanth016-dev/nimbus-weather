import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SearchBar from '../components/search/SearchBar.jsx';
import RecentSearches from '../components/search/RecentSearches.jsx';
import PinnedChips from '../components/search/PinnedChips.jsx';
import CurrentWeatherCard from '../components/weather/CurrentWeatherCard.jsx';
import WeatherStatGrid from '../components/weather/WeatherStatGrid.jsx';
import HourlyForecast from '../components/weather/HourlyForecast.jsx';
import DailyForecast from '../components/weather/DailyForecast.jsx';
import WeeklyTrendChart from '../components/weather/WeeklyTrendChart.jsx';
import AirQualityCard from '../components/weather/AirQualityCard.jsx';
import SunTimeline from '../components/weather/SunTimeline.jsx';
import WeatherAlerts from '../components/weather/WeatherAlerts.jsx';
import MapCard from '../components/weather/MapCard.jsx';
import TravelVideoCard from '../components/weather/TravelVideoCard.jsx';
import AdvisorCard from '../components/weather/AdvisorCard.jsx';
import LoadingState from '../components/common/LoadingState.jsx';
import ErrorState from '../components/common/ErrorState.jsx';
import { useGeolocation } from '../hooks/useGeolocation.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';
import { searchWeather, toggleFavorite as toggleFavoriteApi } from '../services/weatherService.js';
import { getSessionId } from '../utils/session.js';

const MAX_RECENTS = 6;

const Forecast = ({ initialRecord }) => {
  const [record, setRecord] = useState(initialRecord || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastQuery, setLastQuery] = useState(null);
  const [recents, setRecents] = useLocalStorage('nimbus_recent_searches', []);
  const [pinnedRefreshKey, setPinnedRefreshKey] = useState(0);

  const { locate, loading: locating } = useGeolocation();
  const sessionId = getSessionId();

  useEffect(() => {
    if (initialRecord && initialRecord._id !== record?._id) {
      setRecord(initialRecord);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRecord]);

  const pushRecent = (item) => {
    setRecents((prev) => {
      const filtered = prev.filter((r) => r.label !== item.label);
      return [item, ...filtered].slice(0, MAX_RECENTS);
    });
  };

  const runSearch = useCallback(
    async (params, queryMeta) => {
      setLoading(true);
      setError(null);
      setLastQuery({ params, queryMeta });
      try {
        const result = await searchWeather({ ...params, sessionId });
        setRecord(result);
        pushRecent({
          label: queryMeta?.label || result.displayName || result.location,
          latitude: result.latitude,
          longitude: result.longitude,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [sessionId]
  );

  const handleSearch = (text) => runSearch({ location: text }, { label: text });

  const handleUseLocation = async () => {
    const result = await locate();
    if (result.error) {
      setError(result.error);
      return;
    }
    runSearch(
      { latitude: result.latitude, longitude: result.longitude, isCurrentLocation: true },
      { label: 'Current Location' }
    );
  };

  const handleSelectRecent = (item) =>
    runSearch({ latitude: item.latitude, longitude: item.longitude }, { label: item.label });

  const handleSelectPinned = (item) =>
    runSearch({ latitude: item.latitude, longitude: item.longitude }, { label: item.displayName || item.location });

  const handleToggleFavorite = async () => {
    if (!record?._id) return;
    const next = !record.isFavorite;
    setRecord((prev) => ({ ...prev, isFavorite: next }));
    try {
      await toggleFavoriteApi(record._id, next);
      setPinnedRefreshKey((k) => k + 1);
    } catch {
      setRecord((prev) => ({ ...prev, isFavorite: !next }));
    }
  };

  const handleRetry = () => {
    if (lastQuery) runSearch(lastQuery.params, lastQuery.queryMeta);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-3">
        <SearchBar onSearch={handleSearch} onUseLocation={handleUseLocation} locating={locating} />
        <PinnedChips onSelect={handleSelectPinned} refreshKey={pinnedRefreshKey} />
        <RecentSearches items={recents} onSelect={handleSelectRecent} onClear={() => setRecents([])} />
      </div>

      <div className="mt-6">
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div key="loading" exit={{ opacity: 0 }}>
              <LoadingState />
            </motion.div>
          )}

          {!loading && error && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ErrorState message={error} onRetry={handleRetry} />
            </motion.div>
          )}

          {!loading && !error && !record && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="panel flex flex-col items-center gap-2 px-6 py-20 text-center"
            >
              <p className="font-display text-xl font-semibold">Search any place on Earth</p>
              <p className="max-w-sm text-sm text-atmosphere-500 dark:text-mist-200/60">
                Try a city name, ZIP/postal code, coordinates like "51.5, -0.12", a landmark, or use your current
                location.
              </p>
            </motion.div>
          )}

          {!loading && !error && record && (
            <motion.div
              key={record._id || `${record.latitude}-${record.longitude}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-5"
            >
              <WeatherAlerts alerts={record.alerts} />

              <CurrentWeatherCard
                record={record}
                isFavorite={record.isFavorite}
                onToggleFavorite={handleToggleFavorite}
              />

              <WeatherStatGrid currentWeather={record.currentWeather} />

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                <div className="flex flex-col gap-5 lg:col-span-2">
                  <HourlyForecast hourly={record.hourlyForecast} />
                  <WeeklyTrendChart forecast={record.forecast} />
                  <DailyForecast forecast={record.forecast} />
                  <MapCard
                    latitude={record.latitude}
                    longitude={record.longitude}
                    label={record.displayName || record.location}
                  />
                </div>
                <div className="flex flex-col gap-5">
                  <AdvisorCard recordId={record._id} />
                  <SunTimeline currentWeather={record.currentWeather} />
                  <AirQualityCard airQuality={record.airQuality} />
                  <TravelVideoCard video={record.travelVideo} cityName={record.displayName || record.location} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Forecast;
