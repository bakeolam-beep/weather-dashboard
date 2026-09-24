export function getWeatherTheme(weatherCode: number, isDay: boolean): string {
  if (weatherCode === 0) {
    return isDay ? 'clear-day' : 'clear-night';
  }

  switch (weatherCode) {
    case 1:
    case 2:
    case 3:
      return 'cloudy';
    case 45:
    case 48:
      return 'foggy';
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return 'rainy';
    case 71:
    case 73:
    case 75:
      return 'snowy';
    case 95:
    case 96:
    case 99:
      return 'stormy';
    default:
      return 'cloudy';
  }
}
