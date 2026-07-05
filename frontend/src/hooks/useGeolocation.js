import { useCallback, useState } from 'react';

/**
 * Wraps the browser Geolocation API with loading/error state so the
 * "Use My Current Location" button can drive a simple UI state machine.
 */
export const useGeolocation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const locate = useCallback(() => {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        const message = 'Geolocation is not supported by your browser.';
        setError(message);
        resolve({ error: message });
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLoading(false);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          setLoading(false);
          const message =
            err.code === err.PERMISSION_DENIED
              ? 'Location access was denied. Enable it in your browser settings to use this feature.'
              : 'We could not determine your location. Please try searching manually.';
          setError(message);
          resolve({ error: message });
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  return { locate, loading, error };
};
