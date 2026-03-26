import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { QuestionsModule } from '@/module/questions.module.js';
import { DatabaseModule } from '../database/database.module.js';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    QuestionsModule,
  ],
  controllers: [
    CreateAccountController,
  ],
})
export class HttpModule {}