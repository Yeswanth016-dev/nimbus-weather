import { useState } from 'react';
import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import Forecast from './pages/Forecast.jsx';
import HistoryLogs from './pages/HistoryLogs.jsx';
import Settings from './pages/Settings.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { UnitsProvider } from './context/UnitsContext.jsx';

function App() {
  const [view, setView] = useState('forecast');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleSelectFromHistory = (record) => {
    setSelectedRecord(record);
    setView('forecast');
  };

  return (
    <ThemeProvider>
      <UnitsProvider>
        <div className="min-h-screen">
          <Header view={view} onViewChange={setView} />
          <main>
            {view === 'forecast' && <Forecast initialRecord={selectedRecord} />}
            {view === 'history' && <HistoryLogs onSelectRecord={handleSelectFromHistory} />}
            {view === 'settings' && <Settings />}
          </main>
          <Footer />
        </div>
      </UnitsProvider>
    </ThemeProvider>
  );
}

export default App;
