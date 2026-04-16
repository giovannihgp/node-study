import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma.module.js";
import { PrismaQuestionsRepository } from "./prisma/repositories/prisma-question-repository.js";
import { PrismaQuestionCommentsRepository } from "./prisma/repositories/prisma-question-comments-repository.js";
import { PrismaQuestionAttachmentsRepository } from "./prisma/repositories/prisma-question-attachments-repository.js";
import { PrismaAnswerRepository } from "./prisma/repositories/prisma-answer-repository.js";
import { PrismaAnswerCommentsRepository } from "./prisma/repositories/prisma-answer-comments-repository.js";
import { PrismaAnswerAttachmentsRepository } from "./prisma/repositories/prisma-answer-attachments-repository.js";
import {
    QUESTIONS_REPOSITORY,
    QUESTIONS_COMMENTS_REPOSITORY,
    QUESTIONS_ATTACHMENTS_REPOSITORY,
    ANSWER_REPOSITORY,
    ANSWER_COMMENTS_REPOSITORY,
    ANSWER_ATTACHMENTS_REPOSITORY,
    STUDENTS_REPOSITORY,
    ATTACHMENTS_REPOSITORY
} from "./prisma/repositories/repositories.tokens.js";
import { PrismaStudentsRepository } from "./prisma/repositories/prisma-students-repository.js";
import { PrismaAttachmentsRepository } from "./prisma/repositories/prisma-attachments-repository.js";

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
        {
            provide: STUDENTS_REPOSITORY,
            useClass: PrismaStudentsRepository,
        },
        {
            provide: ATTACHMENTS_REPOSITORY,
            useClass: PrismaAttachmentsRepository,
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
        STUDENTS_REPOSITORY,
        ATTACHMENTS_REPOSITORY,
    ],
})
export class DatabaseModule {}