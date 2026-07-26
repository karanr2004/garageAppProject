import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Customer } from '../models/Customer';
import { getDataSource } from '../utils/dataSource';

@Service()
export class CustomerService {
  private get repo(): Repository<Customer> {
    return getDataSource().getRepository(Customer);
  }

  public findAll(): Promise<Customer[]> {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  public findOne(id: number): Promise<Customer | null> {
    return this.repo.findOne({ where: { id } });
  }

  public create(data: Partial<Customer>): Promise<Customer> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  public async update(id: number, data: Partial<Customer>): Promise<Customer | null> {
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
