import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from './Customer';
import { Vehicle } from './Vehicle';
import { JobCard } from './JobCard';
import { InvoiceItem } from './InvoiceItem';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'invoice_number', length: 30, unique: true })
  public invoiceNumber: string;

  @Column({ name: 'job_card_id', nullable: true })
  public jobCardId?: number;

  @OneToOne(() => JobCard, (jobCard) => jobCard.invoice, { nullable: true })
  @JoinColumn({ name: 'job_card_id' })
  public jobCard?: JobCard;

  @Column({ name: 'customer_id' })
  public customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'customer_id' })
  public customer: Customer;

  @Column({ name: 'vehicle_id' })
  public vehicleId: number;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.invoices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicle_id' })
  public vehicle: Vehicle;

  @Column({ name: 'invoice_date', type: 'date' })
  public invoiceDate: string;

  @Column({ name: 'payment_method', length: 30, default: 'Cash' })
  public paymentMethod: string;

  @Column({ name: 'total_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  public totalAmount: number;

  @Column({ name: 'next_service_km', type: 'int', nullable: true })
  public nextServiceKm?: number;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true, eager: true })
  public items: InvoiceItem[];

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
