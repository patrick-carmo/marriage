import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { DataFolder } from './dataFolder.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  videoId: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.id)
  userId: User;

  @ManyToOne(() => DataFolder, (folder) => folder.id)
  dataFolder: DataFolder;

  @CreateDateColumn()
  createdAt: Date;
}
