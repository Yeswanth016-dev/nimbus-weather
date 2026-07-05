/**
 * Generates (and persists) an anonymous session id so search history /
 * favorites can be scoped per-browser without requiring user accounts.
 */
export const getSessionId = () => {
  const key = 'PMA_session_id';
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(key, id);
  }
  return id;
};
