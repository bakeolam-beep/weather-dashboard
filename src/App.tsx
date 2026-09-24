import { useState, useEffect } from 'react';
import { getCurrentWeather, searchLocation } from './services/weatherApi';
import { getWeatherTheme } from './utils/weatherTheme';
import type { LocationResult, WeatherResponse } from './types/weather';
import { CurrentWeather } from './components/CurrentWeather';
import { Forecast } from './components/Forecast';
import './App.css';

function App() {
  const [weather, setWeather] = useState<WeatherResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [usingLocation, setUsingLocation] = useState(false);
  const weatherTheme = weather ? getWeatherTheme(weather.current.weatherCode, weather.current.isDay) : '';

  const loadWeatherForLocation = async (location: LocationResult) => {
    setLoading(true);
    setError(null);
    setSearchError(null);
    try {
      const data = await getCurrentWeather(location.latitude, location.longitude, location);
      setWeather(data);
    } catch {
      setError('Unable to load weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    if (loading || usingLocation) return;

    setUsingLocation(true);
    setLoading(true);
    setError(null);
    setSearchError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      const location = {
        name: 'Your Location',
        latitude,
        longitude,
        country: '',
      } as LocationResult;

      await loadWeatherForLocation(location);
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case GeolocationPositionError.PERMISSION_DENIED:
            setError('Location permission was denied. Please allow location access and try again.');
            break;
          case GeolocationPositionError.POSITION_UNAVAILABLE:
            setError('Your location could not be determined. Please try again.');
            break;
          case GeolocationPositionError.TIMEOUT:
            setError('Location request timed out. Please try again.');
            break;
          default:
            setError('Unable to determine your location. Please try again.');
        }
      } else {
        setError('Unable to determine your location. Please try again.');
      }
    } finally {
      setUsingLocation(false);
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
      } catch {
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
        <button
          type="button"
          className="geo-button"
          onClick={handleUseLocation}
          disabled={loading || usingLocation}
          aria-busy={usingLocation}
        >
          {usingLocation ? 'Locating...' : 'Use My Location'}
        </button>
      </form>

      {error && (
        <p className="search-error" role="alert">
          {error}
        </p>
      )}

      {searchError && (
        <p id="search-error" className="search-error" role="alert">
          {searchError}
        </p>
      )}

      {weather && <CurrentWeather weather={weather} />}
      {weather && <Forecast forecast={weather.daily} />}
    </div>
  );
}

export default App;