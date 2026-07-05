import { ApiError } from '../utils/apiResponse.js';

/**
 * Validates the body of POST /weather requests before hitting the DB or
 * any external service. Keeps controllers focused on business logic.
 */
export const validateWeatherQuery = (req, res, next) => {
  const { location, latitude, longitude } = req.body;

  const hasLocation = typeof location === 'string' && location.trim().length > 0;
  const hasCoords =
    latitude !== undefined &&
    longitude !== undefined &&
    !Number.isNaN(Number(latitude)) &&
    !Number.isNaN(Number(longitude));

  if (!hasLocation && !hasCoords) {
    return next(
      new ApiError(400, 'Provide either a "location" string or "latitude"/"longitude" coordinates')
    );
  }

  if (hasCoords) {
    const lat = Number(latitude);
    const lon = Number(longitude);
    if (lat < -90 || lat > 90) return next(new ApiError(400, 'Latitude must be between -90 and 90'));
    if (lon < -180 || lon > 180) return next(new ApiError(400, 'Longitude must be between -180 and 180'));
  }

  next();
};

export const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return next(new ApiError(400, 'Invalid record id'));
  }
  next();
};
