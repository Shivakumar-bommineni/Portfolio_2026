// Unique ID for this specific tab instance (lives only in memory — not shared)
export const TAB_ID = Math.random().toString(36).slice(2, 10);

const ACTIVE_TAB_KEY = 'shiv_active_tab';
const AUTH_KEY       = 'shiv_auth_user';
const CHANNEL_NAME   = 'shiv_auth_channel';

// ── BroadcastChannel (cross-tab real-time messaging) ──────────────────────
export const channel =
  typeof BroadcastChannel !== 'undefined'
    ? new BroadcastChannel(CHANNEL_NAME)
    : null;

export const broadcast = (type, payload = {}) => {
  channel?.postMessage({ type, tabId: TAB_ID, ...payload });
};

// ── Auth cache (localStorage so all tabs can read safe user identity) ─────────
// In accordance with Client Portal security architecture:
// ZERO TOKENS (accessToken / refreshToken) are ever written to localStorage.
// All tokens live exclusively in HttpOnly cookies and temporary JavaScript memory.
export const readAuth = () => {
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return null; }
};

export const writeAuth = (user) => {
  if (user) {
    const { accessToken, token, refreshToken, ...safeUser } = user;
    localStorage.setItem(AUTH_KEY, JSON.stringify(safeUser));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
};

// ── Tab lock (which tab currently owns the session) ───────────────────────
export const claimTab = () =>
  localStorage.setItem(ACTIVE_TAB_KEY, TAB_ID);

export const releaseTab = () => {
  if (localStorage.getItem(ACTIVE_TAB_KEY) === TAB_ID)
    localStorage.removeItem(ACTIVE_TAB_KEY);
};

export const isActiveTab = () =>
  !localStorage.getItem(ACTIVE_TAB_KEY) ||
  localStorage.getItem(ACTIVE_TAB_KEY) === TAB_ID;
