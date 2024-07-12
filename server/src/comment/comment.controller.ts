import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/user/entity/user.entity';
import { Request } from 'express';
import { CommentService } from './comment.service';
import { ParamId } from 'src/shared/decorators/param-id.decorator';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@UseGuards(GoogleAuthGuard, RoleGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Roles(Role.Admin, Role.User)
  @Get('list')
  async list(@Query() paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;

    return this.commentService.list(page, limit);
  }

  @Roles(Role.Admin, Role.User)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create')
  async createComment(
    @Body() { content }: CreateCommentDTO,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.commentService.create({ content, user });
  }

  @Roles(Role.Admin)
  @Delete('delete/:id')
  async deleteComment(@ParamId() id: number) {
    return this.commentService.delete({ id });
  }
}
