import { User } from 'src/user/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { FolderType } from './enum/folderType';

@Entity({
  name: 'folders',
})
export class Folder {
  @PrimaryGeneratedColumn()
  id?: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ unique: true })
  folder_id: string;

  @ManyToOne(() => Folder, (folder) => folder.id, { nullable: true })
  @JoinColumn({ name: 'parent_folder_id' })
  parent_folder?: Folder;

  @Column({
    type: 'enum',
    enum: FolderType,
  })
  folder_type: FolderType;

  @CreateDateColumn()
  create_at?: Date;
}
