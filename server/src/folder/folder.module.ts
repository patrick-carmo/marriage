import { forwardRef, Module } from '@nestjs/common';
import { FolderService } from './folder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Folder } from './entity/folder.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Folder]), forwardRef(() => AuthModule)],
  providers: [FolderService],
  exports: [FolderService],
})
export class FolderModule {}
