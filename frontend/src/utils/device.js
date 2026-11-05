/**
 * Deterministic Device Fingerprinting & Environment Identification
 * Generates consistent RFC 4122 UUID without reliance on fragile localStorage alone.
 */

function getWebglSignal() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return 'no-webgl';
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'no-debug-info';
    const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
    return `${vendor}~${renderer}`;
  } catch (e) {
    return 'webgl-err';
  }
}

function getCanvasSignal() {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 'no-2d';
    ctx.textBaseline = 'top';
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('ShivakumarDev, MDM#2026', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.fillText('ShivakumarDev, MDM#2026', 4, 17);
    const dataUrl = canvas.toDataURL();
    let hash = 0;
    for (let i = 0; i < dataUrl.length; i++) {
      hash = (hash << 5) - hash + dataUrl.charCodeAt(i);
      hash |= 0;
    }
    return String(hash);
  } catch (e) {
    return 'canvas-err';
  }
}

function hash128ToUuid(str) {
  let h1 = 0xdeadbeef, h2 = 0x41c64e6d, h3 = 0x12345678, h4 = 0x87654321;
  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ k, 2654435761);
    h2 = Math.imul(h2 ^ k, 1597334677);
    h3 = Math.imul(h3 ^ k, 974241243);
    h4 = Math.imul(h4 ^ k, 2147483647);
  }
  const toHex = (n) => (n >>> 0).toString(16).padStart(8, '0');
  const full = `${toHex(h1)}${toHex(h2)}${toHex(h3)}${toHex(h4)}`;
  return [
    full.slice(0, 8),
    full.slice(8, 12),
    '4' + full.slice(13, 16),
    ((parseInt(full.slice(16, 18), 16) & 0x3f) | 0x80).toString(16) + full.slice(18, 20),
    full.slice(20, 32),
  ].join('-');
}

export function getDeviceId() {
  const cached = localStorage.getItem('cp_device_id');
  if (cached && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(cached)) {
    return cached;
  }

  const rawSignals = [
    navigator.userAgent || '',
    navigator.platform || '',
    (navigator.languages || [navigator.language || '']).join(','),
    String(navigator.hardwareConcurrency || ''),
    String(navigator.deviceMemory || ''),
    `${window.screen?.width || 0}x${window.screen?.height || 0}x${window.screen?.colorDepth || 0}`,
    Intl.DateTimeFormat().resolvedOptions().timeZone || '',
    getWebglSignal(),
    getCanvasSignal(),
  ].join('||');

  const id = hash128ToUuid(rawSignals);
  try {
    localStorage.setItem('cp_device_id', id);
  } catch (e) {
    // localStorage blocked
  }
  return id;
}

export function getDeviceInfo() {
  const ua = navigator.userAgent || '';
  let browser = 'Browser';
  if (ua.includes('Edg/')) browser = 'Microsoft Edge';
  else if (ua.includes('Chrome/')) browser = 'Google Chrome';
  else if (ua.includes('Firefox/')) browser = 'Mozilla Firefox';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Apple Safari';
  else if (ua.includes('OPR/') || ua.includes('Opera/')) browser = 'Opera';

  let os = 'Unknown OS';
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10/11';
  else if (ua.includes('Windows NT 6.3')) os = 'Windows 8.1';
  else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';

  return `${browser} on ${os}`;
}

export async function getUserPinpointLocation() {
  // 1. Check cached session location in sessionStorage
  try {
    const cached = sessionStorage.getItem('shiv_client_geo');
    if (cached) return cached;
  } catch (_) {}

  // 2. Fast GeoIP via ipwho.is with 1500ms timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500);

    const res = await fetch('https://ipwho.is/', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && (data.city || data.region || data.country)) {
        const parts = [data.city, data.region, data.country].filter(Boolean);
        if (parts.length > 0) {
          const locStr = parts.join(', ');
          try { sessionStorage.setItem('shiv_client_geo', locStr); } catch (_) {}
          return locStr;
        }
      }
    }
  } catch (e) {
    // GeoIP lookup blocked or timed out
  }

  // 3. Fallback: Parse timezone into human-readable city, state, country
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      if (tz === 'Asia/Calcutta' || tz === 'Asia/Kolkata') {
        return 'Hyderabad, Telangana, India';
      }
      return tz.replace(/_/g, ' ');
    }
  } catch (e) {
    // ignore
  }

  return 'India';
}

