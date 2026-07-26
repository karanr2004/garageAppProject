import { Get, JsonController } from 'routing-controllers';
import { Service } from 'typedi';
import { getDataSource } from '../utils/dataSource';

@Service()
@JsonController('/reports')
export class ReportsController {
  @Get('/summary')
  public async summary() {
    const ds = getDataSource();

    const inv = await ds
      .getRepository('inventory_items')
      .createQueryBuilder('i')
      .select('SUM(i.quantity * i.unitPrice)', 'total')
      .getRawOne();

    const exp = await ds
      .getRepository('expenses')
      .createQueryBuilder('e')
      .select('SUM(e.amount)', 'total')
      .getRawOne();

    const invoices = await ds
      .getRepository('invoices')
      .createQueryBuilder('inv')
      .select('SUM(inv.totalAmount)', 'total')
      .getRawOne();

    const totalInventoryValue = Number(inv?.total || 0);
    const totalExpenses = Number(exp?.total || 0);
    const totalRevenue = Number(invoices?.total || 0);

    return {
      totalInventoryValue,
      totalExpenses,
      totalRevenue,
    };
  }
}
