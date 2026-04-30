import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "'data:'", "'https:'"],
        },
      },
      crossOriginOpenerPolicy: false,
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
    }),
  );

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowerdOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];

      if (allowerdOrigins.includes('*') || allowerdOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers',
    ],
    credentials: true,
    maxAge: 86400,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Marketplace API Gateway')
    .setDescription(
      `
        API Gateway para o sistema de Marketplace com MicrosServiços

        Serviços Disponíveis:
        - Users Service: Autenticação e gestão de usuários
        - Products Service: Catálado e gestão de produtos
        - Checkout Service: Carrinho e processamento de pedidos
        - Payments Service: Processamento de pagamentos

        Autenticação:
        - Use JWT Bearer token para rotas protegidas
        - Use Session token para validação de sessão
      `,
    )
    .setVersion('1.0')
    .setContact(
      'Marketplace Team',
      '<http://marketplace.com>',
      'dev@marketplace.com',
    )
    .setLicense('MIT', '<http://opensource.org/licenses/MIT>')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-session-token',
        in: 'header',
        description: 'Session token for user validation',
      },
      'session-auth',
    )
    .addTag('Authentication', 'Endpoints para autenticação e autorização')
    .addTag('Users', 'Endpoints para gestão de usuário')
    .addTag('Products', 'Endpoints para catálago de produtos')
    .addTag('Checkout', 'Endpints para carrinho e pedidos')
    .addTag('Payments', 'Endpoints para processamento de pagamentos')
    .addTag('Health', 'Endpoints para monitoramento de saúde')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {},
    customSiteTitle: 'Marketplace API Gateway Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b82f6 }
    `,
  });

  const port = process.env.PORT || 3005;
  await app.listen(port);

  console.log(`🚀 API Gateway running on port ${port}`);
  console.log(`📚 Swagger documentation: <http://localhost>:${port}/api`);
}

bootstrap();
