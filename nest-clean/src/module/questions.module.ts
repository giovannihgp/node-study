import { Module } from "@nestjs/common";
import { AuthModule } from "@/infra/auth/auth.module.js";
import { CreateQuestionController } from "@/infra/http/controllers/create-question.controller.js";
import { FetchRecentQuestionsController } from "@/infra/http/controllers/fetch-recent-questions.controller.js";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question.js";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions.js";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { GetQuestionBySlugController } from "@/infra/http/controllers/get-question-by-slug.controller.js";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug.js";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
    ],
    controllers: [
        CreateQuestionController,
        FetchRecentQuestionsController,
        GetQuestionBySlugController,
    ],
    providers: [
        CreateQuestionUseCase,
        FetchRecentQuestionsUseCase,
        GetQuestionBySlugUseCase,
    ],
})
export class QuestionsModule {}