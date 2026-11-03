import axios from 'axios';

const defaultBackendUrl = import.meta.env.PROD
  ? 'https://portfolio-2026-arz2.onrender.com'
  : '';

export const BACKEND_URL = (import.meta.env.VITE_API_URL || defaultBackendUrl).replace(/\/+$/, '');
const apiBaseUrl = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Bearer token to all requests for reliable cross-domain authentication
api.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('shiv_auth_user');
    if (raw) {
      const user = JSON.parse(raw);
      const token = user?.accessToken || user?.token;
      if (token && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore
  }
  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const errCode = error.response?.data?.code || error.response?.data?.error;

    // Check for explicit session revocation by MDM limit displacement
    if (error.response?.status === 401 && errCode === 'SESSION-REVOKED') {
      window.dispatchEvent(
        new CustomEvent('app:force-logout', {
          detail: {
            reason: error.response?.data?.message || 'Your session was terminated because another device logged in.',
          },
        })
      );
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      errCode === 'TOKEN_EXPIRED' &&
      !original._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) =>
          failedQueue.push({ resolve, reject })
        )
          .then(() => api(original))
          .catch((e) => Promise.reject(e));
      }
      original._retry = true;
      isRefreshing = true;
      try {
        let refreshToken = null;
        try {
          const raw = localStorage.getItem('shiv_auth_user');
          if (raw) refreshToken = JSON.parse(raw)?.refreshToken;
        } catch {
          // ignore
        }

        const res = await api.post('/auth/refresh', { refreshToken });
        if (res.data?.user) {
          try {
            const raw = localStorage.getItem('shiv_auth_user');
            const prev = raw ? JSON.parse(raw) : {};
            localStorage.setItem('shiv_auth_user', JSON.stringify({ ...prev, ...res.data.user }));
          } catch {
            // ignore
          }
          if (res.data.user.accessToken) {
            original.headers.Authorization = `Bearer ${res.data.user.accessToken}`;
          }
        }
        processQueue(null);
        return api(original);
      } catch (e) {
        processQueue(e);
        window.location.href = '/login';
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  sendOTP: (phone) => api.post('/auth/send-otp', { phone }),
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  forceLogoutAndLogin: (data) => api.post('/auth/sessions/force-logout-and-login', data),
  getActiveSessions: () => api.get('/auth/sessions'),
  revokeSession: (sessionId) => api.delete(`/auth/sessions/${sessionId}`),
  forgotPasswordSendOTP: (phone) => api.post('/auth/forgot-password/send-otp', { phone }),
  resetPassword: (data) => api.post('/auth/forgot-password/reset', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export const superAdminAPI = {
  getStats: () => api.get('/super-admin/stats'),
  getAdmins: () => api.get('/super-admin/admins'),
  createAdmin: (data) => api.post('/super-admin/admins/create', data),
  toggleAdmin: (id) => api.put(`/super-admin/admins/${id}/toggle`),
  deleteAdmin: (id) => api.delete(`/super-admin/admins/${id}`),
  getUsers: (params) => api.get('/super-admin/users', { params }),
  toggleUser: (id) => api.put(`/super-admin/users/${id}/toggle`),
  getAuditLogs: () => api.get('/super-admin/audit-logs'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
};

export const notesAPI = {
  getAll: (params) => api.get('/notes', { params }),
  create: (data) => api.post('/notes', data),
  update: (id, data) => api.put(`/notes/${id}`, data),
  delete: (id) => api.delete(`/notes/${id}`),
};

export const interviewAPI = {
  getAll: (params) => api.get('/interview', { params }),
  create: (data) => api.post('/interview', data),
  update: (id, data) => api.put(`/interview/${id}`, data),
  delete: (id) => api.delete(`/interview/${id}`),
};

export const portfolioAPI = {
  getPublic: () => api.get('/portfolio/public'),
  get: () => api.get('/portfolio'),
  save: (config) => api.put('/portfolio', { config }),
};

export const resumeAPI = {
  get: () => api.get('/resume'),
  save: (data) => api.put('/resume', { data }),
};

export const learningAPI = {
  getAll: () => api.get('/learning'),
  create: (data) => api.post('/learning', data),
  update: (id, data) => api.put(`/learning/${id}`, data),
  delete: (id) => api.delete(`/learning/${id}`),
};

export const todoAPI = {
  getAll: () => api.get('/todos'),
  create: (data) => api.post('/todos', data),
  update: (id, data) => api.put(`/todos/${id}`, data),
  delete: (id) => api.delete(`/todos/${id}`),
};

export const bookmarkAPI = {
  getAll: () => api.get('/bookmarks'),
  create: (data) => api.post('/bookmarks', data),
  update: (id, data) => api.put(`/bookmarks/${id}`, data),
  delete: (id) => api.delete(`/bookmarks/${id}`),
};

export const projectAPI = {
  getAll: () => api.get('/projects'),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

export const contactAPI = {
  send: (data) => api.post('/contact', data),
};

export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  getUnreadCount: (params) => api.get('/notifications/unread-count', { params }),
  markRead: (id) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  dismiss: (id) => api.delete(`/notifications/${id}`),
  registerPushToken: (data) => api.post('/notifications/push-token', data),
  unregisterPushToken: (data) => api.delete('/notifications/push-token', { data }),
  getSettings: () => api.get('/notifications/settings'),
  updateSettings: (data) => api.put('/notifications/settings', data),
  sendTest: (data) => api.post('/notifications/test', data),
};

export const chatAPI = {
  status: () => api.get('/chat/status'),
  // Returns a raw fetch Response with streaming body — not axios
  stream: (messages) =>
    fetch(`${apiBaseUrl}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    }),
};

export default api;
