import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { QuestionsModule } from '@/module/questions.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { CryptographyModule } from '../cryptography/cryptography.module.js';
import { StudentModule } from '@/module/student.module.js';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    QuestionsModule,
    CryptographyModule,
    StudentModule,
  ],
  controllers: [
    CreateAccountController,
  ],
})
export class HttpModule {}