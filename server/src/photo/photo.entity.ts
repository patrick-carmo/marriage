import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Folder } from '../folder/folder.entity';

@Entity({
  name: 'photos',
})
export class Photo {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ unique: true })
  photo_id: string;

  @Column({ nullable: true })
  content?: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Folder, (folder) => folder.folder_id)
  @JoinColumn({ name: 'folder_id' })
  folder: Folder;

  @CreateDateColumn()
  create_at?: Date;
}
