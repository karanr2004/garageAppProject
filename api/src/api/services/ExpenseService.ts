import { Service } from 'typedi';
import { Repository } from 'typeorm';
import { Expense } from '../models/Expense';
import { getDataSource } from '../utils/dataSource';

@Service()
export class ExpenseService {
  private get repo(): Repository<Expense> {
    return getDataSource().getRepository(Expense);
  }

  public findAll(): Promise<Expense[]> {
    return this.repo.find({ order: { id: 'DESC' } });
  }

  public findOne(id: number): Promise<Expense | null> {
    return this.repo.findOne({ where: { id } });
  }

  public async create(payload: Partial<Expense>): Promise<Expense> {
    const e = this.repo.create({
      date: payload.date || new Date().toISOString().slice(0, 10),
      category: payload.category || 'General',
      amount: payload.amount || 0,
      notes: payload.notes,
    });
    return this.repo.save(e);
  }
}
