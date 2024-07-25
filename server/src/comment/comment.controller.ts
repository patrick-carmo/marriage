import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/shared/decorators/role.decorator';
import { Role } from 'src/shared/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CommentService } from './comment.service';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { User } from 'src/user/entity/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ParamId } from 'src/shared/decorators/param-id.decorator';
import {
  SwaggerCommentCreateDecorator,
  SwaggerCommentDeleteDecorator,
  SwaggerCommentListDecorator,
} from './decorators/comment-swagger.decorator';

@ApiTags('comment')
@ApiBearerAuth()
@UseGuards(AuthGuard, RoleGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @SwaggerCommentListDecorator()
  @Roles(Role.Admin)
  @Get('list')
  async list(@Query() paginationQuery: PaginationQueryDto) {
    const { page, limit } = paginationQuery;

    return this.commentService.list(page, limit);
  }

  @SwaggerCommentCreateDecorator()
  @UseInterceptors(NoFilesInterceptor())
  @Post('create')
  async createComment(
    @Body() { content }: CreateCommentDTO,
    @UserDecorator() user: User,
  ) {
    return this.commentService.create({ content, user });
  }

  @SwaggerCommentDeleteDecorator()
  @Roles(Role.Admin)
  @Delete('delete/:id')
  async deleteComment(@ParamId() id: number) {
    return this.commentService.delete({ id });
  }
}
