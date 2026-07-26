import 'reflect-metadata';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { winstonLoader } from './loaders/winstonLoader';
import { iocLoader } from './loaders/iocLoader';
import { eventDispatchLoader } from './loaders/eventDispatchLoader';
import { typeormLoader } from './loaders/typeormLoader';
import { getDataSource } from './api/utils/dataSource';
import { Logger } from './lib/logger/Logger';

const log = new Logger(__filename);

async function seedPhase2() {
  await bootstrapMicroframework({ loaders: [winstonLoader, iocLoader, eventDispatchLoader, typeormLoader] });
  const ds = getDataSource();

  try {
    const inventoryRepo = ds.getRepository('inventory_items');
    const invCount = await inventoryRepo.count();
    if (invCount === 0) {
      await inventoryRepo.save([
        { name: 'Engine Oil (1L)', sku: 'EO-1L', quantity: 20, unitPrice: 350 },
        { name: 'Brake Pads', sku: 'BP-01', quantity: 10, unitPrice: 400 },
        { name: 'Air Filter', sku: 'AF-99', quantity: 15, unitPrice: 150 },
      ]);
      log.info('Inventory seeded');
    } else {
      log.info('Inventory already present, skipping');
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error('Inventory seed failed: ' + msg);
  }

  try {
    const expensesRepo = ds.getRepository('expenses');
    const expCount = await expensesRepo.count();
    if (expCount === 0) {
      await expensesRepo.save([
        { date: new Date().toISOString().slice(0, 10), category: 'Utilities', amount: 1200, notes: 'Electricity bill' },
        { date: new Date().toISOString().slice(0, 10), category: 'Supplies', amount: 2500, notes: 'Cleaning and rags' },
      ]);
      log.info('Expenses seeded');
    } else {
      log.info('Expenses already present, skipping');
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.error('Expenses seed failed: ' + msg);
  }

  process.exit(0);
}

seedPhase2().catch((e) => {
  log.error('Seed phase2 failed: ' + (e instanceof Error ? e.stack : String(e)));
  process.exit(1);
});
