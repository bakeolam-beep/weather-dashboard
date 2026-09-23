import type { WeatherResponse } from '../types/weather';
import { getWeatherDescription, getWeatherIcon } from '../services/weatherApi';

interface CurrentWeatherProps {
  weather: WeatherResponse;
}

export function CurrentWeather({ weather }: CurrentWeatherProps) {
  const { location, current } = weather;
  const description = getWeatherDescription(current.weatherCode);
  const icon = getWeatherIcon(current.weatherCode, current.isDay);

  return (
    <div className="weather-card">
      <div className="location">
        <h2 className="city">{location.name}</h2>
        <p className="country">{location.country}</p>
      </div>

      <div className="current-weather">
        <div className="weather-icon" aria-hidden="true">{icon}</div>
        <div className="temperature">{Math.round(current.temperature)}°C</div>
        <p className="description">{description}</p>
      </div>

      <div className="details">
        <div className="detail">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">{Math.round(current.apparentTemperature)}°C</span>
        </div>
        <div className="detail">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">{current.humidity}%</span>
        </div>
        <div className="detail">
          <span className="detail-label">Wind</span>
          <span className="detail-value">{current.windSpeed} km/h</span>
        </div>
      </div>
    </div>
  );
}