import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function SwaggerAuthLoginDecorator() {
  return applyDecorators(
    ApiResponse({
      status: 200,
      example: {
        accessToken: 'eyJhbG... (Auth JWT)',
      },
    }),
  );
}
