import { Service } from 'typedi';
import { CustomerService } from './CustomerService';
import { VehicleService } from './VehicleService';
import { JobCardService } from './JobCardService';
import { InvoiceService } from './InvoiceService';

@Service()
export class DashboardService {
  constructor(
    private customerService: CustomerService,
    private vehicleService: VehicleService,
    private jobCardService: JobCardService,
    private invoiceService: InvoiceService
  ) {}

  public async summary() {
    const [customers, vehicles, openJobs, todayInvoices, recentInvoices] = await Promise.all([
      this.customerService.count(),
      this.vehicleService.count(),
      this.jobCardService.countOpen(),
      this.invoiceService.countToday(),
      this.invoiceService.findRecent(5),
    ]);

    return {
      customers,
      vehicles,
      openJobs,
      todayInvoices,
      recentInvoices,
    };
  }
}
