import { CustomerController } from '../api/controllers/CustomerController';
import { VehicleController } from '../api/controllers/VehicleController';
import { JobCardController } from '../api/controllers/JobCardController';
import { InvoiceController } from '../api/controllers/InvoiceController';
import { SettingsController } from '../api/controllers/SettingsController';
import { DashboardController } from '../api/controllers/DashboardController';
import { AuthController } from '../api/controllers/AuthController';
import { Customer } from '../api/models/Customer';
import { Vehicle } from '../api/models/Vehicle';
import { JobCard } from '../api/models/JobCard';
import { Invoice } from '../api/models/Invoice';
import { InvoiceItem } from '../api/models/InvoiceItem';
import { GarageSetting } from '../api/models/GarageSetting';
import { InventoryController } from '../api/controllers/InventoryController';
import { ExpenseController } from '../api/controllers/ExpenseController';
import { ReportsController } from '../api/controllers/ReportsController';
import { InventoryItem } from '../api/models/InventoryItem';
import { Expense } from '../api/models/Expense';

export const controllers = [
  AuthController,
  CustomerController,
  VehicleController,
  JobCardController,
  InvoiceController,
  SettingsController,
  DashboardController,
  InventoryController,
  ExpenseController,
  ReportsController,
];

export const entities = [Customer, Vehicle, JobCard, Invoice, InvoiceItem, GarageSetting, InventoryItem, Expense];
