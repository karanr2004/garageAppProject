export interface Customer {
  id: number;
  name: string;
  phone: string;
  address?: string;
}

export interface Vehicle {
  id: number;
  customerId: number;
  registrationNo: string;
  make?: string;
  model?: string;
  odometerKm: number;
  customer?: Customer;
}

export type JobCardStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'BILLED';

export interface JobCard {
  id: number;
  customerId: number;
  vehicleId: number;
  status: JobCardStatus;
  notes?: string;
  openedAt: string;
  closedAt?: string;
  customer?: Customer;
  vehicle?: Vehicle;
}

export interface InvoiceItem {
  id?: number;
  description: string;
  amount: number;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  jobCardId?: number;
  customerId: number;
  vehicleId: number;
  invoiceDate: string;
  paymentMethod: string;
  totalAmount: number;
  nextServiceKm?: number;
  items: InvoiceItem[];
  customer?: Customer;
  vehicle?: Vehicle;
}

export interface GarageSetting {
  id: number;
  garageName: string;
  location: string;
  phone: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
}

export interface Expense {
  id: number;
  date: string;
  category: string;
  amount: number;
  notes?: string;
}

export interface DashboardSummary {
  customers: number;
  vehicles: number;
  openJobs: number;
  todayInvoices: number;
  recentInvoices: Invoice[];
}
