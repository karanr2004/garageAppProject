import { Service } from 'typedi';
import { In, Repository } from 'typeorm';
import { JobCard, JobCardStatus } from '../models/JobCard';
import { getDataSource } from '../utils/dataSource';

@Service()
export class JobCardService {
  private get repo(): Repository<JobCard> {
    return getDataSource().getRepository(JobCard);
  }

  public findAll(status?: JobCardStatus): Promise<JobCard[]> {
    const where = status ? { status } : {};
    return this.repo.find({
      where,
      relations: ['customer', 'vehicle'],
      order: { id: 'DESC' },
    });
  }

  public findOne(id: number): Promise<JobCard | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['customer', 'vehicle', 'invoice'],
    });
  }

  public create(data: Partial<JobCard>): Promise<JobCard> {
    const entity = this.repo.create({
      ...data,
      status: data.status || 'OPEN',
      openedAt: data.openedAt || new Date(),
    });
    return this.repo.save(entity);
  }

  public async update(id: number, data: Partial<JobCard>): Promise<JobCard | null> {
    const existing = await this.findOne(id);
    if (!existing) {
      return null;
    }
    Object.assign(existing, data);
    return this.repo.save(existing);
  }

  public async complete(id: number): Promise<JobCard | null> {
    return this.update(id, {
      status: 'COMPLETED',
      closedAt: new Date(),
    });
  }

  public async markBilled(id: number): Promise<JobCard | null> {
    return this.update(id, { status: 'BILLED' });
  }

  public countOpen(): Promise<number> {
    return this.repo.count({
      where: { status: In(['OPEN', 'IN_PROGRESS'] as JobCardStatus[]) },
    });
  }
}
