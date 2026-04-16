import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository.js";
import { PrismaModule } from "@/infra/database/prisma.module.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";
import { PrismaAnswerAttachmentsRepository } from "@/infra/database/prisma/repositories/prisma-answer-attachments-repository.js";
import { PrismaAnswerRepository } from "@/infra/database/prisma/repositories/prisma-answer-repository.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [PrismaModule],
    providers: [
        PrismaService,
        PrismaAnswerRepository,
        PrismaAnswerAttachmentsRepository,
        {
            provide: AnswerAttachmentsRepository,
            useClass: PrismaAnswerAttachmentsRepository,
        },
    ],
    exports: [
        PrismaAnswerRepository,
        AnswerAttachmentsRepository,
    ]
})
export class RepositoryModule {}