import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { PhotoListResponse } from 'src/shared/swagger/swagger-responses';

export function SwaggerPhotoListDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      example: PhotoListResponse,
    }),
    ApiBearerAuth(),
  );
}
