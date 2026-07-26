import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { JobCard } from './JobCard';
import { Invoice } from './Invoice';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'customer_id' })
  public customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.vehicles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  public customer: Customer;

  @Column({ name: 'registration_no', length: 20 })
  public registrationNo: string;

  @Column({ length: 80, nullable: true })
  public make?: string;

  @Column({ length: 80, nullable: true })
  public model?: string;

  @Column({ name: 'odometer_km', type: 'int', default: 0 })
  public odometerKm: number;

  @OneToMany(() => JobCard, (jobCard) => jobCard.vehicle)
  public jobCards: JobCard[];

  @OneToMany(() => Invoice, (invoice) => invoice.vehicle)
  public invoices: Invoice[];

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
