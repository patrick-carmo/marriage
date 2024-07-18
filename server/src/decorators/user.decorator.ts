import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const UserDecorator = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (!request.user)
      return new NotFoundException('Utilize o AuthGuard para obter o usuário');

    return filter ? request.user[filter] : request.user;
  },
);
