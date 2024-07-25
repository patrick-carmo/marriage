import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PaginationQueryDto } from '../shared/dto/pagination-query.dto';
import { PhotoService } from './photo.service';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerPhotoListDecorator } from './decorators/photo-swagger.decorator';

@ApiTags('photo')
@UseGuards(AuthGuard, RoleGuard)
@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @SwaggerPhotoListDecorator()
  @Roles(Role.Admin)
  @Get('list')
  async list(@Query() paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;

    return this.photoService.list(page, limit);
  }
}
