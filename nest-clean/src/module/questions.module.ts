import { Module } from "@nestjs/common";
import { PrismaModule } from "@/database/prisma.module";
import { AuthModule } from "@/infra/auth/auth.module";
import { CreateQuestionController } from "@/infra/http/controllers/create-question.controller";
import { FetchRecentQuestionsController } from "@/infra/http/controllers/fetch-recent-questions.controller";

@Module({
    imports: [
        PrismaModule,
        AuthModule,
    ],
    controllers: [
        CreateQuestionController,
        FetchRecentQuestionsController,
    ],
})
export class QuestionsModule { }