import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

export function SwaggerProfileDecorator() {
  return applyDecorators(
    ApiTags('user'),
    ApiBearerAuth(),
    ApiResponse({
      example: {
        email: 'string',
        name: 'Nome',
        picture: 'Google Picture URL',
        role: 'user | admin',
      },
    }),
  );
}
