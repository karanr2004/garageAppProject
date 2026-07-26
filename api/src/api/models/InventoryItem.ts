import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ length: 150 })
  public name: string;

  @Column({ length: 50, nullable: true })
  public sku?: string;

  @Column({ type: 'int', default: 0 })
  public quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  public unitPrice: number;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
