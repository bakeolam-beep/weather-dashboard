export interface LocationResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
}

export interface CurrentWeatherData {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: string;
  weatherCode: number;
  maxTemperature: number;
  minTemperature: number;
  precipitationProbability: number;
}

export interface WeatherResponse {
  location: LocationResult;
  current: CurrentWeatherData;
  daily: DailyForecast[];
}