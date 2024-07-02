import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Folder } from './folder.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

Injectable();
export class FolderService {
  constructor(
    @InjectRepository(Folder)
    private readonly folderRepository: Repository<Folder>,
  ) {}

  async findFolder(user: User, folder_type: Folder['folder_type']) {
    return this.folderRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        folder_type,
      },
    });
  }

  async findAll() {
    return this.folderRepository.find();
  }

  async create(folder: Folder) {
    return this.folderRepository.save(folder);
  }
}
