import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Documentação API - Marriage')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
      description: 'Insira o token JWT',
    })
    .setDescription(
      'API para recebimento de mensagens dos convidados do casamento',
    )
    .setContact(
      'Patrick do Carmo',
      'https://patrick-carmo.github.io/portfolio/',
      'ptemy5@gmail.com',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
