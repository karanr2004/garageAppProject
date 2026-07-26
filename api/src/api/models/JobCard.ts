import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { Vehicle } from './Vehicle';
import { Invoice } from './Invoice';

export type JobCardStatus = 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'BILLED';

@Entity('job_cards')
export class JobCard {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'customer_id' })
  public customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.jobCards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  public customer: Customer;

  @Column({ name: 'vehicle_id' })
  public vehicleId: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.jobCards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  public vehicle: Vehicle;

  @Column({ length: 20, default: 'OPEN' })
  public status: JobCardStatus;

  @Column({ type: 'text', nullable: true })
  public notes?: string;

  @Column({ name: 'opened_at', type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  public openedAt: Date;

  @Column({ name: 'closed_at', type: 'datetime', nullable: true })
  public closedAt?: Date;

  @OneToOne(() => Invoice, (invoice) => invoice.jobCard)
  public invoice?: Invoice;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
