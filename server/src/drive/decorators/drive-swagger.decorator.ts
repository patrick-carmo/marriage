import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export function SwaggerUploadVideoDecorator() {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          video: {
            type: 'string',
            format: 'binary',
            description: 'O vídeo deve ser menor que 1GB',
          },
          uuid: {
            type: 'string',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      example: {
        videoId: 'Google drive video ID',
        url: 'Google drive URL',
      },
    }),
  );
}

export function SwaggerUploadPhotoDecorator() {
  return applyDecorators(
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          photo: {
            type: 'string',
            format: 'binary',
          },
          uuid: {
            type: 'string',
          },
          content: {
            type: 'string',
          },
        },
      },
    }),
    ApiResponse({
      status: 201,
      example: {
        videoId: 'Google drive photo ID',
        url: 'Google drive URL',
      },
    }),
  );
}

export function SwaggerDriveDeleteAllDecorator() {
  return applyDecorators(
    ApiOperation({
      description: 'Deleta todos os arquivos do Google Drive. Atenção!',
    }),
    ApiResponse({
      status: 200,
    }),
  );
}
