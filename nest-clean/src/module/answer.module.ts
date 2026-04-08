import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { AuthModule } from "@/infra/auth/auth.module.js";
import { AnswerQuestionController } from "@/infra/http/controllers/answer-question.controller.js";
import { AnswerQuestionUseCase } from "@/domain/forum/application/use-cases/answer-question.js";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer.js";
import { EditAnswerController } from "@/infra/http/controllers/edit-answer.controller.js";
import { DeleteAnswerController } from "@/infra/http/controllers/delete-answer.controller.js";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer.js";
import { FetchQuestionAnswerSController } from "@/infra/http/controllers/fetch-question-answers.controller.js";
import { FetchQuestionAnswersUseCase } from "@/domain/forum/application/use-cases/fetch-question-answers.js";
import { ChooseQuestionBestAnswerController } from "@/infra/http/controllers/choose-question-best-answer.controller.js";
import { ChooseQuestionBestAnswerUseCase } from "@/domain/forum/application/use-cases/choose-question-best-answer.js";
import { CommentOnAnswerController } from "@/infra/http/controllers/comment-on-answer.controller.js";
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer.js";
import { DeleteAnswerCommentController } from "@/infra/http/controllers/delete-answer-comment.controller.js";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment.js";
import { FetchAnswerCommentsController } from "@/infra/http/controllers/fetch-answer-comments.controller.js";
import { FetchAnswerCommentsUseCase } from "@/domain/forum/application/use-cases/fetch-answer-comments.js";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
    ],
    controllers: [
        AnswerQuestionController,
        EditAnswerController,
        DeleteAnswerController,
        FetchQuestionAnswerSController,
        ChooseQuestionBestAnswerController,
        CommentOnAnswerController,
        DeleteAnswerCommentController,
        FetchAnswerCommentsController,
    ],
    providers: [
        AnswerQuestionUseCase,
        EditAnswerUseCase,
        DeleteAnswerUseCase,
        FetchQuestionAnswersUseCase,
        ChooseQuestionBestAnswerUseCase,
        CommentOnAnswerUseCase,
        DeleteAnswerCommentUseCase,
        FetchAnswerCommentsUseCase,
    ],
})
export class AnswerModule {}