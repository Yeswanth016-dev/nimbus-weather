# Nimbus &mdash; Live Weather Instrument

A full-stack weather application with a React + Vite frontend and a Node.js + Express + MongoDB backend. Search any city, ZIP/postal code, GPS coordinates, or landmark and get a detailed instrument-panel readout across three views: **Forecast**, **History & Logs**, and **Settings**.

> Original implementation — architecture, UI, and code are written from scratch, not copied from any third-party reference.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## Features

### Forecast Tab
- Search by **city, town, village, ZIP/postal code, GPS coordinates ("lat,lon"), or landmark**
- **"Use My Current Location"** button via the browser Geolocation API, with graceful handling of denied/unavailable permissions
- **Pinned favorites** shown as removable chips, plus **recent search history** (persisted in `localStorage`)
- Current temperature, "feels like," condition, icon, humidity, wind speed & direction, pressure, visibility, UV index, sunrise/sunset with a live day-progress timeline, and local date/time
- **Hourly forecast** strip for the rest of the day
- **Weekly temperature trend chart** (Max/Min lines, Recharts)
- **5-day forecast** cards with chance of rain
- **Real interactive Leaflet map** — GPS lock indicator, live lat/lng readout, "Center Weather" and "My Location" controls, dark CARTO basemap tiles
- **Air Quality Index** card with pollutant breakdown (PM2.5, PM10, O₃, NO₂, CO)
- **AI Weather Advisor** — generates short clothing/activity recommendations from live conditions (genuine LLM call if `ANTHROPIC_API_KEY` is set on the backend; otherwise a deterministic rule-based generator, so the feature always works)
- **YouTube travel video** suggestion for the searched city (optional, requires a YouTube Data API key)
- **Weather alerts** banner when official alerts are available

### History & Logs Tab
- **Date-Range Query** — search your own saved history by location and date range
- **Saved Archives** — CRUD list of favorited locations: refresh, un-favorite, or delete each entry

### Settings Tab
- **Temperature scale toggle** (°C / °F), applied instantly across the whole app
- **Dark/light theme toggle**, persisted and defaulting to system preference
- **Live backend/database status indicator** — pings the API's health check so connectivity issues are easy to diagnose
- **Export Search History** in five formats: JSON, CSV, PDF, XML, and Markdown

### Engineering
- Fully **responsive** across desktop, tablet, and mobile
- **Dynamic backgrounds** on the current-conditions card that shift with weather condition and day/night
- Loading and error states for slow networks, invalid locations, denied permissions, and API/network failures
- Smooth transitions via Framer Motion; clean, modular architecture on both ends

---

## Technologies Used

**Frontend**
- React 18 + Vite, Tailwind CSS, Axios
- Framer Motion (animation), Recharts (charts)
- Leaflet.js (loaded via CDN) for the real interactive map
- Lucide React (icons)

**Backend**
- Node.js + Express.js, MongoDB + Mongoose
- Axios (calls to OpenWeatherMap / YouTube / Anthropic)
- pdfkit (PDF export), json2csv (CSV export)
- Helmet, CORS, express-rate-limit, Morgan

**External APIs**
- [OpenWeatherMap](https://openweathermap.org/api) — Geocoding, Current Weather, 5-day/3-hour Forecast, Air Pollution, One Call (UV index & alerts)
- [YouTube Data API v3](https://developers.google.com/youtube/v3) — optional travel video bonus
- [Anthropic API](https://docs.claude.com) — optional, powers genuine LLM-generated advice on the AI Weather Advisor card
- OpenStreetMap / CARTO tiles via Leaflet.js — no map API key required

---

## Folder Structure

```
weather-app/
├── backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── models/Weather.js
│   │   ├── controllers/weatherController.js
│   │   ├── routes/weatherRoutes.js
│   │   ├── middleware/{errorHandler.js, validateRequest.js}
│   │   ├── services/
│   │   │   ├── geocodeService.js       # City/ZIP/coordinate resolution
│   │   │   ├── openWeatherService.js   # Current/forecast/AQI/UV+alerts
│   │   │   ├── youtubeService.js       # Optional travel video lookup
│   │   │   ├── advisorService.js       # AI advice (LLM or rule-based fallback)
│   │   │   └── exportService.js        # XML / Markdown export builders
│   │   ├── utils/{asyncHandler.js, apiResponse.js}
│   │   └── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/           # Header (3-tab nav), Footer
│   │   │   ├── search/           # SearchBar, RecentSearches, PinnedChips
│   │   │   ├── weather/          # Current/Hourly/Daily/WeeklyTrend/AQI/Map/
│   │   │   │                     # Advisor/Export/DateRangeQuery/FavoritesPanel/etc.
│   │   │   └── common/           # ThemeToggle, LoadingState, ErrorState, FavoriteButton
│   │   ├── context/              # ThemeContext, UnitsContext
│   │   ├── hooks/                # useGeolocation, useLocalStorage, useDebounce
│   │   ├── services/              # api.js (Axios instance), weatherService.js
│   │   ├── utils/                 # formatters.js, weatherTheme.js, session.js
│   │   ├── pages/
│   │   │   ├── Forecast.jsx       # Search + current + forecasts + map + advisor
│   │   │   ├── HistoryLogs.jsx    # Date-Range Query + Saved Archives
│   │   │   └── Settings.jsx       # Units, theme, DB status, export
│   │   ├── App.jsx, main.jsx, index.css
│   ├── index.html                 # includes Leaflet CDN CSS/JS
│   ├── tailwind.config.js, vite.config.js, package.json, .env.example
│
└── README.md
```

---

## Installation

### Prerequisites
- Node.js 18+, npm
- A MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- A free [OpenWeatherMap API key](https://openweathermap.org/api)

### Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm run dev             # http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # fill in your values
npm run dev             # http://localhost:5173
```

Open `http://localhost:5173` in your browser.

> **"Network error — unable to reach the server"?** This means the frontend can't reach the backend. Check that (1) the backend is actually running, (2) `VITE_API_BASE_URL` in `frontend/.env` points to the correct backend URL (including the `/api` suffix), and (3) if deployed, `CLIENT_ORIGIN` on the backend matches your frontend's deployed URL for CORS. The Settings tab's "Connected Database Backend" indicator will show red/unreachable if this is misconfigured.

---

## Environment Variables

### `backend/.env`
| Variable | Description | Required |
|---|---|---|
| `PORT` | Port for the Express server | No (default `5000`) |
| `NODE_ENV` | `development` or `production` | No |
| `MONGO_URI` | MongoDB connection string | **Yes** |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key | **Yes** |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key (travel videos) | No |
| `ANTHROPIC_API_KEY` | Enables genuine LLM advice on the AI Weather Advisor; falls back to rule-based advice if omitted | No |
| `CLIENT_ORIGIN` | Allowed CORS origin (frontend URL) | No |

### `frontend/.env`
| Variable | Description | Required |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the backend API (e.g. `http://localhost:5000/api`) | **Yes** |

---

## API Documentation

Base URL: `http://localhost:5000/api`

### `POST /weather`
Resolves a location, fetches live weather + forecast + air quality + UV/alerts, persists a history record, and returns the full payload (plus an optional `travelVideo`).

**Body (one of):**
```json
{ "location": "Paris, France" }
```
```json
{ "location": "94103" }
```
```json
{ "latitude": 48.8566, "longitude": 2.3522 }
```
Optional: `sessionId`, `isCurrentLocation`.

### `GET /weather`
Paginated search history. Query params: `sessionId`, `favoritesOnly`, `search`, `page`, `limit`.

### `GET /weather/:id`
A single stored record.

### `PUT /weather/:id`
Body may include `isFavorite: boolean` and/or `refresh: true` (re-fetches live weather for the record's coordinates).

### `DELETE /weather/:id`
Deletes a record.

### `GET /weather/history-range`
Backs the History & Logs "Date-Range Query" panel. Query params: `startDate`, `endDate` (required, `YYYY-MM-DD`), `location` (optional filter), `sessionId`. Returns previously-saved records whose timestamps fall in range.

### `POST /weather/:id/advice`
Generates AI Weather Advisor text for a stored record. Returns `{ advice, source }` where `source` is `"llm"` (Anthropic call succeeded) or `"rule-based"` (fallback).

### Export endpoints
- `GET /weather/export/json`
- `GET /weather/export/csv`
- `GET /weather/export/pdf` — formatted PDF report
- `GET /weather/export/xml` — hierarchical XML ledger
- `GET /weather/export/markdown` — Markdown table

All accept an optional `sessionId` query param to scope the export.

### Error format
```json
{ "success": false, "error": "Human-readable message" }
```

### Validation & error handling
- Requires either a non-empty `location` string or valid `latitude`/`longitude` (range-checked).
- Unresolvable locations return `404` with a descriptive message.
- Mongoose validation/cast errors are normalized to `400` responses.
- A missing `OPENWEATHER_API_KEY` returns a clear `500` configuration error instead of a silent failure.
- `GET /api/health` reports live MongoDB connection state (`connected` / `disconnected` / etc.), which the Settings tab surfaces directly.

---

## Deployment

### Backend (Render, Railway, or any Node host)
1. Set environment variables from the table above.
2. Provision MongoDB (Atlas recommended for production).
3. Build: `npm install` — Start: `npm start`

### Frontend (Vercel, Netlify)
1. Set `VITE_API_BASE_URL` to your deployed backend URL (including `/api`).
2. Build: `npm run build` — Output directory: `dist`
3. Update the backend's `CLIENT_ORIGIN` to match your deployed frontend URL.

### Docker (optional)
Both services are plain Node apps and can be containerized individually with a `node:20-alpine` base image, exposing port `5000` (backend) and serving the built `dist/` folder (frontend) via any static file server or Nginx.

---

## Screenshots

> _Add screenshots of the running application here._

| Forecast Tab | History & Logs Tab | Settings Tab |
|---|---|---|
| `screenshots/forecast.png` | `screenshots/history-logs.png` | `screenshots/settings.png` |

---

## License

This project is provided as a demonstration/reference implementation. Adapt freely for your own use.
