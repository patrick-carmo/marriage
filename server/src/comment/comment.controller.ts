import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/enums/role.enum';
import { GoogleAuthGuard } from 'src/guards/google-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { CreateCommentDTO } from './dto/create-comment.dto';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { User } from 'src/user/user.entity';
import { Request } from 'express';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Roles(Role.Admin, Role.User)
  @UseGuards(GoogleAuthGuard, RoleGuard)
  @UseInterceptors(NoFilesInterceptor())
  @Post('create')
  async createComment(
    @Body() { content }: CreateCommentDTO,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.commentService.create({ content, user });
  }
}
