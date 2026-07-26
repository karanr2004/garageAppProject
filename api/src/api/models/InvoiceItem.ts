import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Invoice } from './Invoice';

@Entity('invoice_items')
export class InvoiceItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'invoice_id' })
  public invoiceId: number;

  @ManyToOne(() => Invoice, (invoice) => invoice.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'invoice_id' })
  public invoice: Invoice;

  @Column({ length: 200 })
  public description: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  public amount: number;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
