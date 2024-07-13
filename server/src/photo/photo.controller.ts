import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { PaginationQueryDto } from '../shared/dto/pagination-query.dto';
import { PhotoService } from './photo.service';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';

@UseGuards(GoogleAuthGuard, RoleGuard)
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Roles(Role.Admin)
  @Get('list')
  async list(@Query() paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;

    return this.photoService.list(page, limit);
  }
}
