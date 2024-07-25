import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Role } from 'src/shared/enums/role.enum';
import { CommentListResponse } from 'src/shared/swagger/swagger-responses';

export function SwaggerCommentListDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      example: CommentListResponse,
    }),
    ApiBearerAuth(),
  );
}

export function SwaggerCommentCreateDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 201,
      example: {
        content: 'string',
        user: {
          id: 1,
          google_id: 'string',
          name: 'Nome',
          email: 'string',
          picture: 'Google Picture URL',
          role: Role,
        },
        id: 1,
        created_at: '2021-09-01T00:00:00.000Z',
      },
    }),
  );
}

export function SwaggerCommentDeleteDecorator() {
  return applyDecorators(
    ApiParam({
      name: 'id',
      type: 'number',
    }),
  );
}
