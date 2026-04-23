import { Module } from '@nestjs/common';
import { CreateAccountController } from './controllers/create-account.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { QuestionsModule } from '@/module/questions.module.js';
import { DatabaseModule } from '../database/database.module.js';
import { CryptographyModule } from '../cryptography/cryptography.module.js';
import { StudentModule } from '@/module/student.module.js';
import { AnswerModule } from '@/module/answer.module.js';
import { AttachmentModule } from '@/module/attachment.module.js';
import { NotificationModule } from '@/module/notification.module.js';

@Module({
  imports: [
    AuthModule,
    DatabaseModule,
    QuestionsModule,
    CryptographyModule,
    StudentModule,
    AnswerModule,
    AttachmentModule,
    NotificationModule,
  ],
  controllers: [
    CreateAccountController,
  ],
})
export class HttpModule {}