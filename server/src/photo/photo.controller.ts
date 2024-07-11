import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { PaginationQueryDto } from '../shared/dto/pagination-query.dto';
import { PhotoService } from './photo.service';

@UseGuards(GoogleAuthGuard)
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Get('list')
  async listVideos(@Query() paginationQuery: PaginationQueryDto) {
    const { limit, page } = paginationQuery;

    return this.photoService.list(page, limit);
  }
}
