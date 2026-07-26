import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Vehicle } from './Vehicle';
import { JobCard } from './JobCard';
import { Invoice } from './Invoice';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 150 })
  public name: string;

  @Column({ length: 20 })
  public phone: string;

  @Column({ type: 'text', nullable: true })
  public address?: string;

  @OneToMany(() => Vehicle, (vehicle) => vehicle.customer)
  public vehicles: Vehicle[];

  @OneToMany(() => JobCard, (jobCard) => jobCard.customer)
  public jobCards: JobCard[];

  @OneToMany(() => Invoice, (invoice) => invoice.customer)
  public invoices: Invoice[];

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
