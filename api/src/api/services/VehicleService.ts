import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Vehicle } from '../models/Vehicle';
import { getDataSource } from '../utils/dataSource';

@Service()
export class VehicleService {
  private get repo(): Repository<Vehicle> {
    return getDataSource().getRepository(Vehicle);
  }

  public findAll(customerId?: number): Promise<Vehicle[]> {
    const where = customerId ? { customerId } : {};
    return this.repo.find({
      where,
      relations: ['customer'],
      order: { id: 'DESC' },
    });
  }

  public findOne(id: number): Promise<Vehicle | null> {
    return this.repo.findOne({ where: { id }, relations: ['customer'] });
  }

  public create(data: Partial<Vehicle>): Promise<Vehicle> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  public async update(id: number, data: Partial<Vehicle>): Promise<Vehicle | null> {
    const existing = await this.findOne(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, data);
    return this.repo.save(existing);
  }

  public async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return (result.affected || 0) > 0;
  }

  public count(): Promise<number> {
    return this.repo.count();
  }
}
