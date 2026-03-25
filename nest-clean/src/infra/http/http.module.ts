import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller';
import { AuthModule } from '../auth/auth.module';
import { QuestionsModule } from '@/module/questions.module';
import { DatabaseModule } from '../database/database.module';

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