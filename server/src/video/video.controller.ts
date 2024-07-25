import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { VideoService } from './video.service';
import { PaginationQueryDto } from '../shared/dto/pagination-query.dto';
import { Role } from 'src/shared/enums/role.enum';
import { Roles } from 'src/shared/decorators/role.decorator';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerVideoListDecorator } from './decorators/video-swagger.decorator';

@ApiTags('video')
@UseGuards(AuthGuard, RoleGuard)
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @SwaggerVideoListDecorator()
  @Roles(Role.Admin)
  @Get('list')
  async list(@Query() paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;

    return this.videoService.list(page, limit);
  }
}
