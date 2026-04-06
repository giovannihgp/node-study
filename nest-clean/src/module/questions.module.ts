import { Module } from "@nestjs/common";
import { AuthModule } from "@/infra/auth/auth.module.js";
import { CreateQuestionController } from "@/infra/http/controllers/create-question.controller.js";
import { FetchRecentQuestionsController } from "@/infra/http/controllers/fetch-recent-questions.controller.js";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question.js";
import { FetchRecentQuestionsUseCase } from "@/domain/forum/application/use-cases/fetch-recent-questions.js";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { GetQuestionBySlugController } from "@/infra/http/controllers/get-question-by-slug.controller.js";
import { GetQuestionBySlugUseCase } from "@/domain/forum/application/use-cases/get-question-by-slug.js";
import { EditQuestionController } from "@/infra/http/controllers/edit-question.controller.js";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question.js";
import { DeleteQuestionController } from "@/infra/http/controllers/delete-question.controller.js";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question.js";
import { CommentOnQuestionController } from "@/infra/http/controllers/comment-on-question.controller.js";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question.js";
import { DeleteQuestionCommentController } from "@/infra/http/controllers/delete-question-comment.controller.js";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment.js";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
    ],
    controllers: [
        CreateQuestionController,
        FetchRecentQuestionsController,
        GetQuestionBySlugController,
        EditQuestionController,
        DeleteQuestionController,
        CommentOnQuestionController,
        DeleteQuestionCommentController,
    ],
    providers: [
        CreateQuestionUseCase,
        FetchRecentQuestionsUseCase,
        GetQuestionBySlugUseCase,
        EditQuestionUseCase,
        DeleteQuestionUseCase,
        CommentOnQuestionUseCase,
        DeleteQuestionCommentUseCase,
    ],
})
export class QuestionsModule {}