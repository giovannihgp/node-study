import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '@/database/prisma.module';
import { QuestionsModule } from '@/module/questions.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    QuestionsModule,
  ],
  controllers: [
    CreateAccountController,
  ],
})
export class HttpModule {}