import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { DashboardService } from '../services/DashboardService';

@Service()
@JsonController('/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('/summary')
  public summary(): Promise<any> {
    return this.dashboardService.summary();
  }
}
