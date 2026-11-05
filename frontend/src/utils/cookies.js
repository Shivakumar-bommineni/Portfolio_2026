/**
 * Unified Cookie Wrapper for Client Security & Session Hints
 * Follows the Client Portal Architecture:
 * - Scoped namespace 'cp_' to prevent cross-app collision on shared domains
 * - Automatic Secure flag on HTTPS origins
 * - SameSite=Lax (or None for cross-domain HTTPS)
 * - Zero tokens stored in JS-readable cookies in production (HttpOnly tokens managed by backend Set-Cookie)
 */

const NAMESPACE = 'cp_';
const withNs = (name) => `${NAMESPACE}${name}`;

const isSecureOrigin = () =>
  typeof window !== 'undefined' && window.location.protocol === 'https:';

export const cookie = {
  set: (name, value, options = {}) => {
    if (typeof document === 'undefined') return;
    const key = withNs(name);
    let cookieStr = `${encodeURIComponent(key)}=${encodeURIComponent(value || '')}`;

    if (options.days) {
      const d = new Date();
      d.setTime(d.getTime() + options.days * 24 * 60 * 60 * 1000);
      cookieStr += `; expires=${d.toUTCString()}`;
    }

    cookieStr += `; path=${options.path || '/'}`;

    const secure = options.secure ?? isSecureOrigin();
    if (secure) cookieStr += '; Secure';

    // If secure origin and cross-origin needed, 'None' is supported; otherwise 'Lax'
    cookieStr += `; SameSite=${options.sameSite || (secure ? 'None' : 'Lax')}`;

    document.cookie = cookieStr;
  },

  get: (name) => {
    if (typeof document === 'undefined') return null;
    const key = withNs(name);
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const c of cookies) {
      const [k, ...v] = c.split('=');
      if (decodeURIComponent(k) === key) {
        return decodeURIComponent(v.join('='));
      }
    }
    return null;
  },

  remove: (name, options = {}) => {
    if (typeof document === 'undefined') return;
    const key = withNs(name);
    const secure = options.secure ?? isSecureOrigin();
    let cookieStr = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${options.path || '/'}`;
    if (secure) cookieStr += '; Secure';
    cookieStr += `; SameSite=${options.sameSite || (secure ? 'None' : 'Lax')}`;
    document.cookie = cookieStr;
  },
};

