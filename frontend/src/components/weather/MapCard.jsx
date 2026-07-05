import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Locate } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation.js';

/**
 * Wraps the global `L` (Leaflet) object loaded via CDN in index.html.
 * Using vanilla Leaflet (rather than a React wrapper library) keeps this
 * dependency-free and matches how a hand-rolled "Leaflet.js canvas" works.
 */
const MapCard = ({ latitude, longitude, label }) => {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [gpsStatus, setGpsStatus] = useState('ready'); // ready | locating | locked
  const { locate } = useGeolocation();

  // Initialize the map once.
  useEffect(() => {
    if (!window.L || mapRef.current) return;

    const map = window.L.map(containerRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([latitude, longitude], 11);

    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const marker = window.L.marker([latitude, longitude]).addTo(map).bindPopup(`<strong>${label}</strong>`).openPopup();

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Re-center + move marker whenever the searched location changes.
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    mapRef.current.setView([latitude, longitude], mapRef.current.getZoom());
    markerRef.current.setLatLng([latitude, longitude]).setPopupContent(`<strong>${label}</strong>`);
  }, [latitude, longitude, label]);

  const handleCenter = () => {
    mapRef.current?.setView([latitude, longitude], 12);
    markerRef.current?.openPopup();
  };

  const handleMyLocation = async () => {
  setGpsStatus("locating");

  const result = await locate();

  if (result.error) {
    alert(result.error);
    setGpsStatus("ready");
    return;
  }

  if (!mapRef.current) {
    setGpsStatus("ready");
    return;
  }

  mapRef.current.flyTo([result.latitude, result.longitude], 13, {
    animate: true,
    duration: 2,
  });

  if (markerRef.current) {
    markerRef.current.setLatLng([result.latitude, result.longitude]);
    markerRef.current
      .bindPopup("<strong>Your Current Location</strong>")
      .openPopup();
  }

  setGpsStatus("locked");
};

  return (
    <div className="panel overflow-hidden p-4">
      <div className="mb-2 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-cyan-500" />
          <p className="eyebrow">Interactive Weather Map</p>
        </div>
        <span
          className={`flex items-center gap-1.5 text-xs font-medium ${
            gpsStatus === 'locked' ? 'text-emerald-500' : 'text-atmosphere-400 dark:text-mist-200/40'
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${gpsStatus === 'locked' ? 'bg-emerald-500' : 'bg-atmosphere-400'}`} />
          {gpsStatus === 'locating' ? 'Locating…' : gpsStatus === 'locked' ? 'GPS Locked' : 'GPS Lock Ready'}
        </span>
      </div>

      <p className="data-figure mb-2 px-1 text-xs text-atmosphere-500 dark:text-mist-200/50">
        Lat: {latitude.toFixed(3)}, Lng: {longitude.toFixed(3)}
      </p>

      <div ref={containerRef} className="h-64 w-full overflow-hidden rounded-xl" />

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={handleCenter}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-black/10 py-2 text-xs font-medium text-atmosphere-600 hover:border-cyan-400/60 hover:text-cyan-600 dark:border-white/10 dark:text-mist-200/70"
        >
          <Navigation size={13} /> Center Weather
        </button>
        <button
          onClick={handleMyLocation}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-black/10 py-2 text-xs font-medium text-atmosphere-600 hover:border-emerald-400/60 hover:text-emerald-600 dark:border-white/10 dark:text-mist-200/70"
        >
          <Locate size={13} /> My Location
        </button>
      </div>
    </div>
  );
};

export default MapCard;
