import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma.module";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-question-repository";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository";
import { PrismaAnswerRepository } from "./prisma/repositories/prisma-answer-repository";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository";
import {
    QUESTIONS_REPOSITORY,
    QUESTIONS_COMMENTS_REPOSITORY,
    QUESTIONS_ATTACHMENTS_REPOSITORY,
    ANSWER_REPOSITORY,
    ANSWER_COMMENTS_REPOSITORY,
    ANSWER_ATTACHMENTS_REPOSITORY,
} from "./prisma/repositories/repositories.tokens";

// console.log("#####TESTE#######");

@Module({
    imports: [PrismaModule],
    providers: [
        {
            provide: QUESTIONS_REPOSITORY,
            useClass: PrismaQuestionsRepository,
        },
        {
            provide: QUESTIONS_COMMENTS_REPOSITORY,
            useClass: PrismaQuestionCommentsRepository,
        },
        {
            provide: QUESTIONS_ATTACHMENTS_REPOSITORY,
            useClass: PrismaQuestionAttachmentsRepository,
        },
        {
            provide: ANSWER_REPOSITORY,
            useClass: PrismaAnswerRepository,
        },
        {
            provide: ANSWER_COMMENTS_REPOSITORY,
            useClass: PrismaAnswerCommentsRepository,
        },
        {
            provide: ANSWER_ATTACHMENTS_REPOSITORY,
            useClass: PrismaAnswerAttachmentsRepository,
        },
    ],
    exports: [
        PrismaModule,
        QUESTIONS_REPOSITORY,
        QUESTIONS_COMMENTS_REPOSITORY,
        QUESTIONS_ATTACHMENTS_REPOSITORY,
        ANSWER_REPOSITORY,
        ANSWER_COMMENTS_REPOSITORY,
        ANSWER_ATTACHMENTS_REPOSITORY,
    ],
})
export class DatabaseModule {}