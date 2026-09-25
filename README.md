# Weather Dashboard

A functional, responsive weather dashboard built with React, TypeScript, and Vite. It provides current weather conditions, location search, browser-based geolocation, and a 7-day forecast using live data from Open-Meteo.

## Overview

Weather Dashboard is a lightweight client-side weather application designed around fast access to useful weather information.

The application supports:

* Current weather conditions
* City and location search
* Browser geolocation
* Automatic weather loading for an initial location
* 7-day weather forecasts
* Dynamic weather-condition themes
* Day/night-aware weather presentation
* Temperature and feels-like temperature
* Humidity
* Wind speed
* Precipitation probability
* Weather-condition descriptions and icons
* Loading and error states
* Responsive layouts for different screen sizes

## Features

### Current Weather

Displays the selected location's current:

* Temperature
* Feels-like temperature
* Humidity
* Wind speed
* Weather condition
* Weather icon
* Day/night state

### Location Search

Search for a city or location and retrieve its corresponding weather information.

The application uses Open-Meteo's geocoding service to resolve search queries into geographic coordinates before requesting weather data.

### Use My Location

The application can use the browser's Geolocation API to determine the user's current coordinates.

Location handling includes feedback for:

* Permission denial
* Position unavailable
* Request timeout
* Unsupported browser geolocation
* General location errors

### 7-Day Forecast

The forecast section displays seven days of weather information, including:

* Day
* Weather condition
* Weather icon
* Maximum temperature
* Minimum temperature
* Probability of precipitation

### Dynamic Weather Themes

The interface adapts its visual presentation according to the current weather condition and whether the reported conditions are during daytime or nighttime.

## Technology Stack

* **React 19**
* **TypeScript 6**
* **Vite 8**
* **ESLint 10**
* **Open-Meteo Weather API**
* **Open-Meteo Geocoding API**
* **CSS**

## Data Sources

Weather data is provided by **Open-Meteo**.

The application uses:

* Open-Meteo Forecast API for current and daily weather data
* Open-Meteo Geocoding API for location search

No weather API key is required for the current implementation.

## Project Structure

```text
weather-dashboard/
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── assets/
│   │   └── hero.png
│   │
│   ├── components/
│   │   ├── CurrentWeather.tsx
│   │   ├── Forecast.tsx
│   │   └── Forecast.css
│   │
│   ├── services/
│   │   └── weatherApi.ts
│   │
│   ├── types/
│   │   └── weather.ts
│   │
│   ├── utils/
│   │   ├── formatDate.ts
│   │   └── weatherTheme.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js
* npm

### Installation

Clone the repository:

```bash
git clone https://github.com/bakeolam-beep/weather-dashboard.git
```

Move into the project directory:

```bash
cd weather-dashboard
```

Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

Vite will provide a local development URL in the terminal.

### Production Build

Create an optimized production build:

```bash
npm run build
```

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Lint

Run ESLint:

```bash
npm run lint
```

## How It Works

The application follows a simple data flow:

```text
User
 │
 ├── Search for a location
 │       │
 │       ▼
 │   Open-Meteo Geocoding API
 │       │
 │       ▼
 │   Latitude + Longitude
 │
 └── Use My Location
         │
         ▼
   Browser Geolocation API
         │
         ▼
   Latitude + Longitude
         │
         ▼
   Open-Meteo Forecast API
         │
         ▼
   Current Weather + Daily Forecast
         │
         ▼
   Weather Dashboard
```

For the initial application state, the dashboard loads weather information for Lagos, Nigeria.

## Weather Conditions

Weather condition codes returned by Open-Meteo are mapped into human-readable descriptions and corresponding visual indicators.

Supported condition groups include:

* Clear sky
* Partly cloudy
* Fog
* Drizzle
* Rain
* Snow
* Rain showers
* Thunderstorm
* Thunderstorm with hail

## Browser Geolocation

The **Use My Location** feature requires browser permission to access the user's location.

The application does not require an account or store a user's geographic coordinates as part of the current implementation.

If permission is denied, the application provides an appropriate error message and the user can continue using city search.

## API Reliability

The application includes defensive handling for malformed or incomplete API responses.

Weather requests validate required current-weather fields and daily forecast arrays before displaying the data.

The application also handles:

* Failed network requests
* Empty search results
* Invalid search queries
* Missing weather data
* Missing forecast data
* Mismatched forecast arrays

## Available Scripts

| Command           | Purpose                                  |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Start the development server             |
| `npm run build`   | Type-check and create a production build |
| `npm run preview` | Preview the production build             |
| `npm run lint`    | Run ESLint                               |

## Deployment

The application is a static Vite/React application and can be deployed to modern static hosting platforms.

A production deployment should use the generated `dist` directory produced by:

```bash
npm run build
```

## Browser Support

The application relies on standard modern browser capabilities, including:

* ES modules
* Fetch API
* CSS
* Browser Geolocation API

The **Use My Location** feature depends on browser support and permission for the Geolocation API.

## License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

## Author

Built by **BakeBeep**.

GitHub:

https://github.com/bakeolam-beep/weather-dashboard

---

Built as part of the BakeBeep software studio project portfolio.
