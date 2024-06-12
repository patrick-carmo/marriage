import { Module } from '@nestjs/common';
import { DataFolderService } from './data-folder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataFolder } from './data-folder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DataFolder])],
  providers: [DataFolderService],
  exports: [DataFolderService],
})
export class DataFolderModule {}
