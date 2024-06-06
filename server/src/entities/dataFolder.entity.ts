import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class DataFolder {
  @PrimaryGeneratedColumn({
    unsigned: true,
  })
  id: number;

  @Column({ unique: true })
  folderId: string;

  @ManyToOne(() => User, (user) => user.id)
  userId: User;

  @CreateDateColumn()
  createdAt: Date;
}
