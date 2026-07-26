import { Service } from 'typedi';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Invoice } from '../models/Invoice';
import { InvoiceItem } from '../models/InvoiceItem';
import { JobCardService } from './JobCardService';
import { getDataSource } from '../utils/dataSource';

export interface CreateInvoicePayload {
  jobCardId?: number;
  customerId: number;
  vehicleId: number;
  invoiceDate?: string;
  paymentMethod?: string;
  nextServiceKm?: number;
  items: Array<{ description: string; amount: number }>;
}

@Service()
export class InvoiceService {
  constructor(private jobCardService: JobCardService) {}

  private get repo(): Repository<Invoice> {
    return getDataSource().getRepository(Invoice);
  }

  private get itemRepo(): Repository<InvoiceItem> {
    return getDataSource().getRepository(InvoiceItem);
  }

  public findAll(): Promise<Invoice[]> {
    return this.repo.find({
      relations: ['customer', 'vehicle', 'items'],
      order: { id: 'DESC' },
    });
  }

  public findOne(id: number): Promise<Invoice | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['customer', 'vehicle', 'items', 'jobCard'],
    });
  }

  private async nextInvoiceNumber(): Promise<string> {
    const last = await this.repo.find({
      order: { id: 'DESC' },
      take: 1,
    });
    const next = last.length ? last[0].id + 1 : 1;
    return `INV-${String(next).padStart(4, '0')}`;
  }

  public async create(payload: CreateInvoicePayload): Promise<Invoice> {
    if (payload.jobCardId) {
      const jobCard = await this.jobCardService.findOne(payload.jobCardId);
      if (!jobCard) {
        throw new Error('Job card not found');
      }
      if (jobCard.status !== 'COMPLETED') {
        throw new Error('Only completed job cards can be billed');
      }
    }

    const totalAmount = payload.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const today = new Date().toISOString().slice(0, 10);

    const invoice = this.repo.create({
      invoiceNumber: await this.nextInvoiceNumber(),
      jobCardId: payload.jobCardId,
      customerId: payload.customerId,
      vehicleId: payload.vehicleId,
      invoiceDate: payload.invoiceDate || today,
      paymentMethod: payload.paymentMethod || 'Cash',
      totalAmount,
      nextServiceKm: payload.nextServiceKm,
      items: payload.items.map((item) =>
        this.itemRepo.create({
          description: item.description,
          amount: item.amount,
        })
      ),
    });

    const saved = await this.repo.save(invoice);

    if (payload.jobCardId) {
      await this.jobCardService.markBilled(payload.jobCardId);
    }

    return (await this.findOne(saved.id)) as Invoice;
  }

  public async countToday(): Promise<number> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.repo.count({
      where: { createdAt: MoreThanOrEqual(today) },
    });
  }

  public findRecent(limit = 5): Promise<Invoice[]> {
    return this.repo.find({
      relations: ['customer', 'vehicle'],
      order: { id: 'DESC' },
      take: limit,
    });
  }
}
