import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { VideoService } from './video.service';
import { PaginationQueryDto } from '../shared/dto/pagination-query.dto';

@UseGuards(GoogleAuthGuard)
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('list')
  async list(@Query() paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;

    return this.videoService.list(page, limit);
  }
}
