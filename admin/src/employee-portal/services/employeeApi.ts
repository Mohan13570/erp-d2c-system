import axios, { type AxiosError } from 'axios';

const TOKEN_KEY = 'employee_token';

export const employeeApi = axios.create({
  baseURL: '/api/employee-portal',
  headers: { 'Content-Type': 'application/json' },
});

employeeApi.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

employeeApi.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ error?: string; message?: string }>) => {
    const message =
      err.response?.data?.error ??
      err.response?.data?.message ??
      err.message ??
      'An unexpected error occurred';
    return Promise.reject(new Error(message));
  }
);

export const employeePortalService = {
  // Auth
  login: (email: string, password: string) =>
    employeeApi.post('/auth/login', { email, password }),
  getMe: () => employeeApi.get('/auth/me'),
  changePassword: (currentPassword: string, newPassword: string) =>
    employeeApi.post('/auth/change-password', { currentPassword, newPassword }),
  setup2FA: () => employeeApi.post('/auth/2fa/setup'),
  verify2FA: (code: string, secret: string) => employeeApi.post('/auth/2fa/verify', { code, secret }),
  disable2FA: (currentPassword: string) => employeeApi.post('/auth/2fa/disable', { currentPassword }),

  // Dashboard
  getDashboardSummary: () => employeeApi.get('/dashboard/summary'),
  getOpsSummary: () => employeeApi.get('/dashboard/ops'),

  // Shipments Management
  getShipments: (params?: Record<string, any>) => employeeApi.get('/shipments', { params }),
  getShipmentDetail: (id: string) => employeeApi.get(`/shipments/${id}`),
  createStaffBooking: (payload: Record<string, any>) => employeeApi.post('/shipments', payload),
  transitionShipmentStatus: (id: string, nextStatus: string, remarks?: string) =>
    employeeApi.post(`/shipments/${id}/status-transition`, { nextStatus, remarks }),
  assignShipmentVendor: (id: string, payload: Record<string, any>) =>
    employeeApi.post(`/shipments/${id}/vendor-assign`, payload),
  flagShipmentException: (id: string, payload: Record<string, any>) =>
    employeeApi.post(`/shipments/${id}/exception`, payload),
  uploadShipmentDocument: (id: string, payload: Record<string, any>) =>
    employeeApi.post(`/shipments/${id}/documents`, payload),

  // Quotations Management
  getQuotes: (params?: Record<string, any>) => employeeApi.get('/quotes', { params }),
  getRateCards: (params?: Record<string, any>) => employeeApi.get('/quotes/rate-cards', { params }),
  createManualQuote: (payload: Record<string, any>) => employeeApi.post('/quotes', payload),
  approveQuote: (id: string, payload: Record<string, any>) => employeeApi.post(`/quotes/${id}/approve`, payload),
  sendQuoteToCustomer: (id: string) => employeeApi.post(`/quotes/${id}/send`),
  convertQuoteToBooking: (id: string, payload?: Record<string, any>) => employeeApi.post(`/quotes/${id}/convert-booking`, payload),
  markQuoteLost: (id: string, payload: Record<string, any>) => employeeApi.post(`/quotes/${id}/mark-lost`, payload),

  // Advanced Documents & Compliance Module
  getShipmentDocumentTracker: (shipmentId: string) => employeeApi.get(`/documents/shipment/${shipmentId}`),
  generateShipmentDocument: (payload: { shipmentId: string; docType: string; reasonForReprint?: string }) => employeeApi.post('/documents/generate', payload),
  runBulkDocumentJob: (payload: { shipmentIds: string[]; docTypes?: string[] }) => employeeApi.post('/documents/bulk-job', payload),
  getComplianceRepository: (params?: Record<string, any>) => employeeApi.get('/documents/compliance', { params }),
  uploadComplianceDoc: (payload: Record<string, any>) => employeeApi.post('/documents/compliance', payload),

  // Billing, Credit Control & Reconciliation Module
  getBillingInvoices: (params?: Record<string, any>) => employeeApi.get('/billing/invoices', { params }),
  createManualInvoice: (payload: Record<string, any>) => employeeApi.post('/billing/invoices', payload),
  getCreditControlDashboard: () => employeeApi.get('/billing/credit-control'),
  reconcilePayment: (payload: Record<string, any>) => employeeApi.post('/billing/reconcile', payload),
  getDisputesQueue: () => employeeApi.get('/billing/disputes'),
  resolveDispute: (id: string, payload: Record<string, any>) => employeeApi.post(`/billing/disputes/${id}/resolve`, payload),
  getCustomerLedger: (customerName: string) => employeeApi.get(`/billing/customer-ledger/${encodeURIComponent(customerName)}`),
  getRecurringContracts: () => employeeApi.get('/billing/recurring-contracts'),
  createRecurringContract: (payload: Record<string, any>) => employeeApi.post('/billing/recurring-contracts', payload),

  // Claims & Insurance Module
  getClaims: (params?: Record<string, any>) => employeeApi.get('/claims', { params }),
  getClaimDetail: (id: string) => employeeApi.get(`/claims/${id}`),
  createClaimIntake: (payload: Record<string, any>) => employeeApi.post('/claims', payload),
  updateClaimInvestigation: (id: string, payload: Record<string, any>) => employeeApi.post(`/claims/${id}/investigate`, payload),
  updateClaimInsurance: (id: string, payload: Record<string, any>) => employeeApi.post(`/claims/${id}/insurance`, payload),
  approveClaimPayout: (id: string, payload: Record<string, any>) => employeeApi.post(`/claims/${id}/approve`, payload),
  getClaimsAgingReport: () => employeeApi.get('/claims/aging-report'),

  // Reverse Logistics & Returns Module
  getReturns: (params?: Record<string, any>) => employeeApi.get('/returns', { params }),
  getReturnDetail: (id: string) => employeeApi.get(`/returns/${id}`),
  createReturnIntake: (payload: Record<string, any>) => employeeApi.post('/returns', payload),
  scheduleReverseBooking: (id: string, payload: Record<string, any>) => employeeApi.post(`/returns/${id}/reverse-booking`, payload),
  transitionReturnStatus: (id: string, nextStatus: string, remarks?: string) =>
    employeeApi.post(`/returns/${id}/status-transition`, { nextStatus, remarks }),

  // Support / Tickets & SLA Escalation Module
  getTickets: (params?: Record<string, any>) => employeeApi.get('/tickets', { params }),
  getTicketDetail: (id: string) => employeeApi.get(`/tickets/${id}`),
  postTicketReply: (id: string, payload: { messageType: string; text: string }) => employeeApi.post(`/tickets/${id}/reply`, payload),
  assignTicket: (id: string, assignedTo: string) => employeeApi.post(`/tickets/${id}/assign`, { assignedTo }),
  routeTicketToClaim: (id: string) => employeeApi.post(`/tickets/${id}/route-to-claim`),
  escalateTicketSla: (id: string) => employeeApi.post(`/tickets/${id}/escalate`),
  getCannedResponses: () => employeeApi.get('/tickets/canned-responses'),
  createCannedResponse: (payload: Record<string, any>) => employeeApi.post('/tickets/canned-responses', payload),

  // Admin & Settings Module
  getRolePermissions: () => employeeApi.get('/settings/roles'),
  updateRolePermissions: (payload: Record<string, any>) => employeeApi.post('/settings/roles', payload),
  getBranches: () => employeeApi.get('/settings/branches'),
  createBranch: (payload: Record<string, any>) => employeeApi.post('/settings/branches', payload),
  getRateCards: () => employeeApi.get('/settings/rate-cards'),
  saveRateCard: (payload: Record<string, any>) => employeeApi.post('/settings/rate-cards', payload),
  getCustomerMasters: () => employeeApi.get('/settings/customers'),
  getVendorMasters: () => employeeApi.get('/settings/vendors'),
  getAuditLogs: (params?: Record<string, any>) => employeeApi.get('/settings/audit-logs', { params }),

  // Personal Account Settings
  updateAccountProfile: (payload: Record<string, any>) => employeeApi.put('/settings/account/profile', payload),
  updateProfilePhoto: (payload: Record<string, any>) => employeeApi.post('/settings/account/photo', payload),
  requestAccountEmailChange: (payload: Record<string, any>) => employeeApi.post('/settings/account/request-email-change', payload),
  verifyAccountEmail: (token: string) => employeeApi.post('/settings/account/verify-email', { token }),
  updateAccountNotifications: (payload: Record<string, any>) => employeeApi.put('/settings/account/notifications', payload),
  requestAccountDeactivation: (payload: Record<string, any>) => employeeApi.post('/settings/account/deactivate', payload),

  // Profile
  getProfile: () => employeeApi.get('/profile'),
  updateProfile: (payload: Record<string, unknown>) =>
    employeeApi.put('/profile', payload),

  // Attendance
  clockIn: (payload?: { latitude?: number; longitude?: number; address?: string }) =>
    employeeApi.post('/attendance/clock-in', payload || {}),
  clockOut: () => employeeApi.post('/attendance/clock-out', {}),
  getMyAttendanceLogs: () => employeeApi.get('/attendance/my-logs'),
  getTeamAttendanceLogs: () => employeeApi.get('/attendance/team-logs'),

  // Leave
  getLeaveBalances: () => employeeApi.get('/leave/balances'),
  applyLeave: (payload: { leaveTypeId: string; startDate: string; endDate: string; reason: string; documentUrl?: string }) =>
    employeeApi.post('/leave/apply', payload),
  getMyLeaveRequests: () => employeeApi.get('/leave/my-requests'),
  getTeamLeaveRequests: () => employeeApi.get('/leave/team-requests'),
  approveLeaveRequest: (id: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) =>
    employeeApi.post(`/leave/approve/${id}`, { status, rejectionReason }),

  // Payroll
  getMyPayslips: () => employeeApi.get('/payroll/my-payslips'),
  getPayslipDetail: (id: string) => employeeApi.get(`/payroll/my-payslips/${id}`),

  // Documents
  getMyDocuments: () => employeeApi.get('/documents/my-documents'),
  getCompanyPolicies: () => employeeApi.get('/documents/company-policies'),

  // Announcements & Directory
  getAnnouncements: () => employeeApi.get('/announcements'),
  createAnnouncement: (payload: { title: string; content: string; type?: string; isPinned?: boolean }) =>
    employeeApi.post('/announcements', payload),
  getDirectory: () => employeeApi.get('/directory'),

  // Support Helpdesk
  getMyTickets: () => employeeApi.get('/support/my-tickets'),
  createTicket: (payload: { category: string; subject: string; description: string; priority?: string }) =>
    employeeApi.post('/support/tickets', payload),
  getAllTickets: () => employeeApi.get('/support/all-tickets'),

  // Notifications
  getNotifications: () => employeeApi.get('/notifications'),
};
