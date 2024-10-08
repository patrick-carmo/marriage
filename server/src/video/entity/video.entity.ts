import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entity/user.entity';
import { Folder } from '../../folder/entity/folder.entity';

@Entity({
  name: 'videos',
})
export class Video {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  video_id: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.folder_id)
  @JoinColumn({ name: 'folder_id' })
  folder: Folder;

  @CreateDateColumn()
  created_at?: Date;
}
