import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ type: 'date' })
  public date: string;

  @Column({ length: 100 })
  public category: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  public amount: number;

  @Column({ type: 'text', nullable: true })
  public notes?: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
