import { useState, useEffect } from 'react';
import { getCurrentWeather } from './services/weatherApi';
import type { LocationResult } from './types/weather';
import { CurrentWeather } from './components/CurrentWeather';
import './App.css';

function App() {
  const [weather, setWeather] = useState<import('./types/weather').WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const lagos: LocationResult = {
      name: 'Lagos',
      latitude: 6.5244,
      longitude: 3.3792,
      country: 'Nigeria',
      country_code: 'NG',
    };

    let mounted = true;

    async function loadWeather() {
      setLoading(true);
      setError(null);
      try {
        const data = await getCurrentWeather(lagos.latitude, lagos.longitude, lagos);
        if (mounted) {
          setWeather(data);
        }
      } catch (err) {
        if (mounted) {
          setError('Unable to load weather data. Please try again.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="app loading">Loading weather...</div>;
  }

  if (error) {
    return <div className="app error">{error}</div>;
  }

  if (!weather) {
    return <div className="app error">No weather data available.</div>;
  }

  return (
    <div className="app">
      <CurrentWeather weather={weather} />
    </div>
  );
}

export default App;