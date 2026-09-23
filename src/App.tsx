import { useState, useEffect } from 'react';
import { getCurrentWeather, searchLocation } from './services/weatherApi';
import type { LocationResult, WeatherResponse } from './types/weather';
import { CurrentWeather } from './components/CurrentWeather';
import './App.css';

function App() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const loadWeatherForLocation = async (location: LocationResult) => {
    setLoading(true);
    setError(null);
    setSearchError(null);
    try {
      const data = await getCurrentWeather(location.latitude, location.longitude, location);
      setWeather(data);
    } catch (err) {
      setError('Unable to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const lagos: LocationResult = {
      name: 'Lagos',
      latitude: 6.5244,
      longitude: 3.3792,
      country: 'Nigeria',
      country_code: 'NG',
    };

    let mounted = true;

    async function loadInitialWeather() {
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

    loadInitialWeather();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setSearchError(null);

    try {
      const results = await searchLocation(query);
      if (results.length === 0) {
        setSearchError('City not found. Try another location.');
        setLoading(false);
        return;
      }

      const location = results[0];
      await loadWeatherForLocation(location);
      setSearchQuery('');
    } catch (err) {
      if (err instanceof Error) {
        setSearchError(err.message);
      } else {
        setSearchError('Search failed. Please try again.');
      }
      setLoading(false);
    }
  };

  if (loading && !weather) {
    return <div className="app loading">Loading weather...</div>;
  }

  if (error && !weather) {
    return <div className="app error">{error}</div>;
  }

  return (
    <div className="app">
      <form className="search-form" onSubmit={handleSearch}>
        <label htmlFor="city-search" className="visually-hidden">
          Search for a city
        </label>
        <input
          id="city-search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a city..."
          disabled={loading}
          aria-describedby={searchError ? 'search-error' : undefined}
        />
        <button type="submit" disabled={loading || !searchQuery.trim()}>
          Search
        </button>
      </form>

      {searchError && (
        <p id="search-error" className="search-error" role="alert">
          {searchError}
        </p>
      )}

      {weather && <CurrentWeather weather={weather} />}
    </div>
  );
}

export default App;