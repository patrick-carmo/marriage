import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataFolder } from './data-folder.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/user.entity';
import { CreateDataFolderDto } from './dto/data-folder-create.dto';

Injectable();
export class DataFolderService {
  constructor(
    @InjectRepository(DataFolder)
    private readonly dataFolderRepository: Repository<DataFolder>,
  ) {}

  async find(user: User) {
    return this.dataFolderRepository.findOneBy({ userId: user.id });
  }

  async findAll() {
    return this.dataFolderRepository.find();
  }

  async create(dataFolder: CreateDataFolderDto) {
    return this.dataFolderRepository.save(dataFolder);
  }
}
