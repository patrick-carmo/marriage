import {
  ExecutionContext,
  createParamDecorator,
  BadRequestException,
} from '@nestjs/common';

export const ParamId = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const id = context.switchToHttp().getRequest().params.id;

    if (!id) {
      throw new BadRequestException('ID é obrigatório');
    }

    const parsedId = Number(id);

    if (isNaN(parsedId)) {
      throw new BadRequestException('ID deve ser um número');
    }

    return parsedId;
  },
);
