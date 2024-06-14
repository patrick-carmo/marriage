import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { DataFolder } from '../dataFolder/data-folder.entity';

@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  videoId: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => DataFolder, (folder) => folder.id)
  @JoinColumn({ name: 'dataFolderId' })
  dataFolder: DataFolder;

  @CreateDateColumn()
  createdAt: Date;
}
