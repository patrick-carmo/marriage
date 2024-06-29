import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Role } from '../enums/role.enum';

@Entity({
  name: 'users',
})
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  google_id: string;

  @Column({ unique: true })
  email: string;

  @Column({
    length: 63,
  })
  name: string;

  @Column({ nullable: true })
  picture?: string;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  last_login?: Date;

  @CreateDateColumn()
  create_at?: Date;

  @Column({ enum: Role, default: Role.User })
  role?: number;
}
