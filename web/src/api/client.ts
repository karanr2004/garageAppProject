import axios from 'axios';
import type {
  Customer,
  DashboardSummary,
  GarageSetting,
  Invoice,
  InvoiceItem,
  JobCard,
  JobCardStatus,
  Vehicle,
} from '../types';
import { clearToken, getToken } from '../auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    // Avoid AxiosHeaders typing incompatibilities by casting to any
    (config.headers as any) = { ...(config.headers as any), Authorization: 'Bearer ' + token };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const customersApi = {
  list: () => api.get<Customer[]>('/customers').then((r) => r.data),
  create: (data: Partial<Customer>) => api.post<Customer>('/customers', data).then((r) => r.data),
  update: (id: number, data: Partial<Customer>) =>
    api.put<Customer>(`/customers/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/customers/${id}`),
};

export const vehiclesApi = {
  list: (customerId?: number) =>
    api
      .get<Vehicle[]>('/vehicles', { params: customerId ? { customerId } : undefined })
      .then((r) => r.data),
  create: (data: Partial<Vehicle>) => api.post<Vehicle>('/vehicles', data).then((r) => r.data),
  update: (id: number, data: Partial<Vehicle>) =>
    api.put<Vehicle>(`/vehicles/${id}`, data).then((r) => r.data),
  remove: (id: number) => api.delete(`/vehicles/${id}`),
};

export const jobCardsApi = {
  list: (status?: JobCardStatus) =>
    api.get<JobCard[]>('/job-cards', { params: status ? { status } : undefined }).then((r) => r.data),
  create: (data: Partial<JobCard>) => api.post<JobCard>('/job-cards', data).then((r) => r.data),
  update: (id: number, data: Partial<JobCard>) =>
    api.put<JobCard>(`/job-cards/${id}`, data).then((r) => r.data),
  complete: (id: number) => api.post<JobCard>(`/job-cards/${id}/complete`).then((r) => r.data),
};

export const invoicesApi = {
  list: () => api.get<Invoice[]>('/invoices').then((r) => r.data),
  get: (id: number) => api.get<Invoice>(`/invoices/${id}`).then((r) => r.data),
  create: (data: {
    jobCardId?: number;
    customerId: number;
    vehicleId: number;
    invoiceDate?: string;
    paymentMethod?: string;
    nextServiceKm?: number;
    items: Array<{ description: string; amount: number }>;
  }) => api.post<Invoice>('/invoices', data).then((r) => r.data),
};

export const settingsApi = {
  get: () => api.get<GarageSetting>('/settings').then((r) => r.data),
  update: (data: Partial<GarageSetting>) =>
    api.put<GarageSetting>('/settings', data).then((r) => r.data),
};

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ token: string; user: { username: string } }>('/auth/login', { username, password }).then((r) => r.data),
};

export const dashboardApi = {
  summary: () => api.get<DashboardSummary>('/dashboard/summary').then((r) => r.data),
};

export const inventoryApi = {
  list: () => api.get('/inventory').then((r) => r.data),
  create: (data: { name: string; sku?: string; quantity: number; unitPrice: number }) =>
    api.post('/inventory', data).then((r) => r.data),
};

export const expensesApi = {
  list: () => api.get('/expenses').then((r) => r.data),
  create: (data: { date?: string; category: string; amount: number; notes?: string }) =>
    api.post('/expenses', data).then((r) => r.data),
};

export const reportsApi = {
  summary: () => api.get('/reports/summary').then((r) => r.data),
};
