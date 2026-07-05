/**
 * Small helpers to keep API response shapes consistent across controllers.
 */
export const ok = (res, data, meta = {}) =>
  res.status(200).json({ success: true, data, ...meta });

export const created = (res, data) =>
  res.status(201).json({ success: true, data });

export const noContent = (res) => res.status(204).send();

export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
