import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-black/5 dark:border-white/5">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="panel flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2 text-cyan-500">
            <ShieldCheck size={18} />
            <p className="font-display text-sm font-semibold">Open Data &amp; Attribution</p>
          </div>
          <p className="text-sm text-atmosphere-600 dark:text-mist-200/60">
            Weather, geocoding, and air-quality data are provided by OpenWeatherMap. Map tiles are rendered with
            Leaflet.js on OpenStreetMap &amp; CARTO base layers.
          </p>
          <div className="grid grid-cols-1 gap-4 border-t border-black/5 pt-4 dark:border-white/5 sm:grid-cols-2">
            <div>
              <p className="eyebrow">Built With</p>
              <p className="mt-1 text-sm">React, Vite, Tailwind CSS, Express, and MongoDB.</p>
            </div>
            <div>
              <p className="eyebrow">Status</p>
              <p className="mt-1 text-sm">Fully client/server separated &mdash; see the Settings tab for live backend status.</p>
            </div>
          </div>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-atmosphere-400 dark:text-mist-200/40">
        PMA Weather &middot; Built for demonstration purposes &middot; Not affiliated with any third-party weather brand.
      </p>
    </footer>
  );
};

export default Footer;
