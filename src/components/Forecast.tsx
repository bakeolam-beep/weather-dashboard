import type { DailyForecast } from '../types/weather';
import { getWeatherDescription, getWeatherIcon } from '../services/weatherApi';
import { formatDayLabel } from '../utils/formatDate';
import './Forecast.css';

interface ForecastProps {
  forecast: DailyForecast[];
}

export function Forecast({ forecast }: ForecastProps) {
  const days = forecast.slice(0, 7);

  return (
    <div className="forecast-container">
      <h3 className="forecast-title">7-Day Forecast</h3>
      <div className="forecast-row">
        {days.map((day) => (
          <div key={day.date} className="forecast-day">
            <div className="forecast-day-name">{formatDayLabel(day.date)}</div>
            <div className="forecast-icon" aria-hidden="true">
              {getWeatherIcon(day.weatherCode, true)}
            </div>
            <div className="forecast-description">{getWeatherDescription(day.weatherCode)}</div>
            <div className="forecast-temps">
              {Math.round(day.maxTemperature)}° / {Math.round(day.minTemperature)}°
            </div>
            <div className="forecast-precip">{day.precipitationProbability}% rain</div>
          </div>
        ))}
      </div>
    </div>
  );
}
