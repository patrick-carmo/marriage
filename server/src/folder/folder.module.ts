import { Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entity/folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Folder])],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}
