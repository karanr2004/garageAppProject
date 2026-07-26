import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('garage_settings')
export class GarageSetting {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'garage_name', length: 200, default: 'S G BABU AUTO GARAGE' })
  public garageName: string;

  @Column({ length: 150, default: 'Thiruvannamalai' })
  public location: string;

  @Column({ length: 20, default: '98765 43210' })
  public phone: string;

  @CreateDateColumn({ name: 'created_at' })
  public createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  public updatedAt: Date;
}
