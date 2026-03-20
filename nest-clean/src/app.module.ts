import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CreateAccountController } from './controllers/create-account.controller';
import { validateEnv } from './env/env.validation';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import { QuestionsModule } from './module/questions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    AuthModule,
    PrismaModule,
    QuestionsModule,
  ],
  controllers: [
    CreateAccountController,
  ],
})
export class AppModule {}
