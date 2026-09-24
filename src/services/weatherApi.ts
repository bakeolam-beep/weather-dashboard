import type { LocationResult, CurrentWeatherData, DailyForecast, WeatherResponse } from '../types/weather';

const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API = 'https://api.open-meteo.com/v1/forecast';

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }
  return response.json() as Promise<T>;
}

export async function searchLocation(query: string): Promise<LocationResult[]> {
  if (!query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  const params = new URLSearchParams({
    name: query.trim(),
    count: '5',
    language: 'en',
    format: 'json',
  });

  const url = `${GEOCODING_API}?${params.toString()}`;

  try {
    interface GeocodingResponse {
      results?: Array<{
        name: string;
        latitude: number;
        longitude: number;
        country: string;
        country_code?: string;
        admin1?: string;
      }>;
    }

    const data = await fetchJson<GeocodingResponse>(url);

    if (!data.results || data.results.length === 0) {
      throw new Error('No locations found for the given query');
    }

    return data.results.map((result) => ({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      country_code: result.country_code,
      admin1: result.admin1,
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to search location', { cause: error });
  }
}

export async function getCurrentWeather(
  latitude: number,
  longitude: number,
  location: LocationResult
): Promise<WeatherResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    timezone: 'auto',
  });

  const url = `${WEATHER_API}?${params.toString()}`;

  try {
    interface WeatherApiResponse {
      current?: {
        temperature_2m?: number;
        relative_humidity_2m?: number;
        apparent_temperature?: number;
        weather_code?: number;
        wind_speed_10m?: number;
        is_day?: number;
      };
      daily?: {
        time?: string[];
        weather_code?: number[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        precipitation_probability_max?: number[];
      };
    }

    const data = await fetchJson<WeatherApiResponse>(url);

    if (!data.current) {
      throw new Error('Weather data is malformed: missing current data');
    }

    const {
      temperature_2m,
      relative_humidity_2m,
      apparent_temperature,
      weather_code,
      wind_speed_10m,
      is_day,
    } = data.current;

    if (
      temperature_2m === undefined ||
      relative_humidity_2m === undefined ||
      apparent_temperature === undefined ||
      weather_code === undefined ||
      wind_speed_10m === undefined ||
      is_day === undefined
    ) {
      throw new Error('Weather data is malformed: missing required fields');
    }

    const current: CurrentWeatherData = {
      temperature: temperature_2m,
      apparentTemperature: apparent_temperature,
      humidity: relative_humidity_2m,
      windSpeed: wind_speed_10m,
      weatherCode: weather_code,
      isDay: is_day === 1,
    };

    const daily = parseDailyForecast(data.daily);

    return { location, current, daily };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch weather data', { cause: error });
  }
}

interface DailyResponse {
  time?: string[];
  weather_code?: number[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  precipitation_probability_max?: number[];
}

function parseDailyForecast(daily: DailyResponse | undefined): DailyForecast[] {
  if (!daily) {
    throw new Error('Weather data is malformed: missing daily forecast data');
  }

  const { time, weather_code, temperature_2m_max, temperature_2m_min, precipitation_probability_max } = daily;

  if (
    !time ||
    !weather_code ||
    !temperature_2m_max ||
    !temperature_2m_min ||
    !precipitation_probability_max
  ) {
    throw new Error('Weather data is malformed: missing daily forecast fields');
  }

  const arrays = [time, weather_code, temperature_2m_max, temperature_2m_min, precipitation_probability_max];
  const length = arrays[0].length;

  if (length === 0) {
    throw new Error('Weather data is malformed: empty daily forecast');
  }

  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i].length !== length) {
      throw new Error('Weather data is malformed: daily forecast arrays have mismatched lengths');
    }
  }

  const result: DailyForecast[] = [];

  for (let i = 0; i < length; i++) {
    const weatherCode = weather_code[i];
    const maxTemp = temperature_2m_max[i];
    const minTemp = temperature_2m_min[i];
    const precip = precipitation_probability_max[i];

    if (
      weatherCode === undefined ||
      maxTemp === undefined ||
      minTemp === undefined ||
      precip === undefined
    ) {
      throw new Error('Weather data is malformed: missing daily forecast value at index ' + i);
    }

    result.push({
      date: time[i],
      weatherCode,
      maxTemperature: maxTemp,
      minTemperature: minTemp,
      precipitationProbability: precip,
    });
  }

  return result;
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code >= 1 && code <= 3) return 'Partly cloudy';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 55) return 'Drizzle';
  if (code >= 61 && code <= 65) return 'Rain';
  if (code >= 71 && code <= 75) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code === 95) return 'Thunderstorm';
  if (code === 96 || code === 99) return 'Thunderstorm with hail';
  return 'Unknown';
}

export function getWeatherIcon(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙';
  if (code >= 1 && code <= 3) return isDay ? '⛅' : '☁️';
  if (code === 45 || code === 48) return '🌫️';
  if (code >= 51 && code <= 55) return '🌦️';
  if (code >= 61 && code <= 65) return '🌧️';
  if (code >= 71 && code <= 75) return '❄️';
  if (code >= 80 && code <= 82) return '🌦️';
  if (code === 95) return '⛈️';
  if (code === 96 || code === 99) return '⛈️';
  return '❓';
}