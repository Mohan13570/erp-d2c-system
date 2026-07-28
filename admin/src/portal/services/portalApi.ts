/**
 * portalApi — Axios instance scoped exclusively to the Customer Portal.
 *
 * - Base URL: /api  (proxied to http://localhost:5000 by Vite)
 * - Auth:     Bearer token read from portal_token (NOT the admin token)
 * - Errors:   Returns typed ApiError so callers can handle gracefully
 *
 * NEVER import the admin axios instance or admin auth token here.
 */
import axios, { type AxiosError } from 'axios';

const TOKEN_KEY = 'portal_token';

export const portalApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach portal JWT on every request
portalApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise errors into a consistent shape
portalApi.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ error?: string; message?: string }>) => {
    const message =
      err.response?.data?.error ??
      err.response?.data?.message ??
      err.message ??
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  },
);

// ─── Typed service helpers ────────────────────────────────────────────────────

/** Portal Auth */
export const portalAuthService = {
  login:    (email: string, password: string) =>
    portalApi.post('/portal/auth/login', { email, password }),
  register: (payload: Record<string, unknown>) =>
    portalApi.post('/portal/auth/register', payload),
  getMe:    () => portalApi.get('/portal/auth/me'),
};

/** Dashboard */
export const portalDashboardService = {
  getStats:   () => portalApi.get('/customer-logistics/dashboard-stats'),
  getFinance: () => portalApi.get('/customer-finance/dashboard'),
};

/** Shipments */
export const portalShipmentsService = {
  list:     () => portalApi.get('/shipments'),
  detail:   (id: string) => portalApi.get(`/shipments/${id}`),
  timeline: (id: string) => portalApi.get(`/customer-tracking/${id}/timeline`),
  create:   (payload: Record<string, unknown>) => portalApi.post('/portal/bookings', payload),
};

/** Quotations */
export const portalQuotationsService = {
  list:    () => portalApi.get('/quotations'),
  rfqList: () => portalApi.get('/quotations/rfqs'),
  accept:  (quotationId: string) =>
    portalApi.put(`/customer-logistics/quotations/${quotationId}/award`),
};

/** Documents */
export const portalDocumentsService = {
  list:   () => portalApi.get('/documents'),
  upload: (payload: Record<string, unknown>) => portalApi.post('/documents', payload),
};

/** Billing */
export const portalBillingService = {
  dashboard: () => portalApi.get('/customer-finance/dashboard'),
  ledger:    () => portalApi.get('/customer-finance/ledger'),
  pay:       (invoiceId: string, amount: number, paymentMethod: string) =>
    portalApi.post('/customer-finance/payment/process', { invoiceId, amount, paymentMethod }),
};

/** Claims & Insurance */
export const portalInsuranceService = {
  policies: () => portalApi.get('/insurance/policies'),
  claims:   () => portalApi.get('/insurance/claims'),
  fileClaim: (payload: Record<string, unknown>) => portalApi.post('/insurance/claims', payload),
};

/** Returns */
export const portalReturnsService = {
  list:   () => portalApi.get('/returns/returns'),
  create: (payload: Record<string, unknown>) => portalApi.post('/returns/returns', payload),
};

/** Support */
export const portalSupportService = {
  tickets:      () => portalApi.get('/customer-support/tickets'),
  createTicket: (payload: Record<string, unknown>) =>
    portalApi.post('/customer-support/tickets', payload),
  aiChat:       (prompt: string) =>
    portalApi.post('/customer-support/ai/chat', { prompt }),
};

/** Profile */
export const portalProfileService = {
  get:    (id: string) => portalApi.get(`/customer-portal/${id}`),
  update: (id: string, payload: Record<string, unknown>) =>
    portalApi.put(`/customer-portal/${id}`, payload),
};
