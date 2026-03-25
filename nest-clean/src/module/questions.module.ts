import { Module } from "@nestjs/common";
import { AuthModule } from "@/infra/auth/auth.module";
import { CreateQuestionController } from "@/infra/http/controllers/create-question.controller";
import { FetchRecentQuestionsController } from "@/infra/http/controllers/fetch-recent-questions.controller";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions";
import { DatabaseModule } from "@/infra/database/database.module";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
    ],
    controllers: [
        CreateQuestionController,
        FetchRecentQuestionsController,
    ],
    providers: [
        CreateQuestionUseCase,
        FetchRecentQuestionsUseCase
    ],
})
export class QuestionsModule { }