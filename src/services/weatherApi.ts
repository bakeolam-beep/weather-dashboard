import type { LocationResult, CurrentWeatherData, WeatherResponse } from '../types/weather';

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

    return { location, current };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to fetch weather data', { cause: error });
  }
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