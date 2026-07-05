import mongoose from 'mongoose';

/**
 * Stores a single weather lookup: the searched location, resolved coordinates,
 * the raw current-weather + forecast payloads, and a timestamp. Acts as both
 * the "search history" and the persisted record required by the REST API.
 */
const hourlyEntrySchema = new mongoose.Schema(
  {
    time: String,
    temp: Number,
    condition: String,
    icon: String,
    pop: Number, // probability of precipitation
  },
  { _id: false }
);

const dailyEntrySchema = new mongoose.Schema(
  {
    date: String,
    tempMin: Number,
    tempMax: Number,
    condition: String,
    icon: String,
    pop: Number,
  },
  { _id: false }
);

const weatherSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: [true, 'Searched location is required'],
      trim: true,
    },
    displayName: { type: String, trim: true },
    country: { type: String, trim: true },
    latitude: {
      type: Number,
      required: true,
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: true,
      min: -180,
      max: 180,
    },
    searchType: {
      type: String,
      enum: ['city', 'zip', 'coordinates', 'landmark', 'current-location'],
      default: 'city',
    },
    currentWeather: {
      temp: Number,
      feelsLike: Number,
      condition: String,
      description: String,
      icon: String,
      humidity: Number,
      windSpeed: Number,
      windDeg: Number,
      pressure: Number,
      visibility: Number,
      uvIndex: Number,
      sunrise: Number,
      sunset: Number,
      timezoneOffset: Number,
    },
    airQuality: {
      aqi: Number,
      co: Number,
      no2: Number,
      o3: Number,
      pm2_5: Number,
      pm10: Number,
    },
    hourlyForecast: [hourlyEntrySchema],
    forecast: [dailyEntrySchema],
    alerts: [
      {
        event: String,
        description: String,
        start: Number,
        end: Number,
      },
    ],
    isFavorite: { type: Boolean, default: false },
    userSessionId: { type: String, index: true }, // groups history per browser/session
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

weatherSchema.index({ location: 'text' });
weatherSchema.index({ latitude: 1, longitude: 1 });

export default mongoose.model('Weather', weatherSchema);
