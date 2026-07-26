import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { InventoryItem } from '../models/InventoryItem';
import { getDataSource } from '../utils/dataSource';

@Service()
export class InventoryService {
  private get repo(): Repository<InventoryItem> {
    return getDataSource().getRepository(InventoryItem);
  }

  public findAll(): Promise<InventoryItem[]> {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  public findOne(id: number): Promise<InventoryItem | null> {
    return this.repo.findOne({ where: { id } });
  }

  public async create(payload: Partial<InventoryItem>): Promise<InventoryItem> {
    const item = this.repo.create({
      name: payload.name,
      sku: payload.sku,
      quantity: payload.quantity || 0,
      unitPrice: payload.unitPrice || 0,
    });
    return this.repo.save(item);
  }
}
