import 'reflect-metadata';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { winstonLoader } from './loaders/winstonLoader';
import { iocLoader } from './loaders/iocLoader';
import { eventDispatchLoader } from './loaders/eventDispatchLoader';
import { typeormLoader } from './loaders/typeormLoader';
import { Customer } from './api/models/Customer';
import { Vehicle } from './api/models/Vehicle';
import { JobCard } from './api/models/JobCard';
import { Invoice } from './api/models/Invoice';
import { InvoiceItem } from './api/models/InvoiceItem';
import { GarageSetting } from './api/models/GarageSetting';
import { getDataSource } from './api/utils/dataSource';
import { Logger } from './lib/logger/Logger';

const log = new Logger(__filename);

async function seed(): Promise<void> {
  await bootstrapMicroframework({
    loaders: [winstonLoader, iocLoader, eventDispatchLoader, typeormLoader],
  });

  const ds = getDataSource();
  const customerRepo = ds.getRepository(Customer);
  const vehicleRepo = ds.getRepository(Vehicle);
  const jobRepo = ds.getRepository(JobCard);
  const invoiceRepo = ds.getRepository(Invoice);
  const itemRepo = ds.getRepository(InvoiceItem);
  const settingsRepo = ds.getRepository(GarageSetting);

  let settings = await settingsRepo.findOne({ where: {} });
  if (!settings) {
    settings = await settingsRepo.save(
      settingsRepo.create({
        garageName: 'S G BABU AUTO GARAGE',
        location: 'Thiruvannamalai',
        phone: '98765 43210',
      })
    );
  }

  const existing = await customerRepo.count();
  if (existing > 0) {
    log.info('Seed skipped — data already exists');
    process.exit(0);
  }

  const customer = await customerRepo.save(
    customerRepo.create({ name: 'Karan', phone: '9876543210', address: 'Thiruvannamalai' })
  );

  const vehicle = await vehicleRepo.save(
    vehicleRepo.create({
      customerId: customer.id,
      registrationNo: 'TN25 AB 1234',
      make: 'Honda',
      model: 'Activa',
      odometerKm: 12000,
    })
  );

  const jobCard = await jobRepo.save(
    jobRepo.create({
      customerId: customer.id,
      vehicleId: vehicle.id,
      status: 'COMPLETED',
      notes: 'Routine service',
      closedAt: new Date(),
    })
  );

  const invoice = invoiceRepo.create({
    invoiceNumber: 'INV-1025',
    jobCardId: jobCard.id,
    customerId: customer.id,
    vehicleId: vehicle.id,
    invoiceDate: '2026-07-26',
    paymentMethod: 'UPI',
    totalAmount: 700,
    nextServiceKm: 15000,
    items: [
      itemRepo.create({ description: 'Engine Oil', amount: 350 }),
      itemRepo.create({ description: 'Brake Service', amount: 200 }),
      itemRepo.create({ description: 'Labour', amount: 150 }),
    ],
  });

  await invoiceRepo.save(invoice);
  await jobRepo.update(jobCard.id, { status: 'BILLED' });

  // Seed Inventory
  try {
    const inventoryRepo = ds.getRepository('inventory_items');
    const invCount = await inventoryRepo.count();
    if (invCount === 0) {
      await inventoryRepo.save([
        { name: 'Engine Oil (1L)', sku: 'EO-1L', quantity: 20, unitPrice: 350 },
        { name: 'Brake Pads', sku: 'BP-01', quantity: 10, unitPrice: 400 },
        { name: 'Air Filter', sku: 'AF-99', quantity: 15, unitPrice: 150 },
      ]);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.info('Inventory seed skipped: ' + msg);
  }

  // Seed Expenses
  try {
    const expensesRepo = ds.getRepository('expenses');
    const expCount = await expensesRepo.count();
    if (expCount === 0) {
      await expensesRepo.save([
        { date: new Date().toISOString().slice(0, 10), category: 'Utilities', amount: 1200, notes: 'Electricity bill' },
        { date: new Date().toISOString().slice(0, 10), category: 'Supplies', amount: 2500, notes: 'Cleaning and rags' },
      ]);
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    log.info('Expenses seed skipped: ' + msg);
  }

  log.info('Seed completed successfully');
  process.exit(0);
}

seed().catch((error) => {
  log.error('Seed failed: ' + error);
  process.exit(1);
});
