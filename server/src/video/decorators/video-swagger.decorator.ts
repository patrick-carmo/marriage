import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { VideoListResponse } from 'src/shared/swagger/swagger-responses';

export function SwaggerVideoListDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      example: VideoListResponse,
    }),
    ApiBearerAuth(),
  );
}
