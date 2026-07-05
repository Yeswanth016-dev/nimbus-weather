import { createContext, useContext, useState } from 'react';

const UnitsContext = createContext(null);

export const UnitsProvider = ({ children }) => {
  const [unit, setUnit] = useState(() => window.localStorage.getItem('nimbus_unit') || 'metric');

  const toggleUnit = () => {
    setUnit((prev) => {
      const next = prev === 'metric' ? 'imperial' : 'metric';
      window.localStorage.setItem('nimbus_unit', next);
      return next;
    });
  };

  /** Converts a Celsius value to the currently selected display unit. */
  const displayTemp = (celsius) => {
    if (celsius === null || celsius === undefined) return '—';
    return unit === 'imperial' ? Math.round((celsius * 9) / 5 + 32) : Math.round(celsius);
  };

  const unitSymbol = unit === 'imperial' ? '°F' : '°C';

  return (
    <UnitsContext.Provider value={{ unit, toggleUnit, displayTemp, unitSymbol }}>{children}</UnitsContext.Provider>
  );
};

export const useUnits = () => {
  const ctx = useContext(UnitsContext);
  if (!ctx) throw new Error('useUnits must be used within a UnitsProvider');
  return ctx;
};
