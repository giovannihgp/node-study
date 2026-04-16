import { PaginationParams } from "@/core/repositories/pagination-params.js";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository.js";
import { Question } from "@/domain/forum/enterprise/entities/question.js";
import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper.js";
import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository.js";
import { QUESTIONS_ATTACHMENTS_REPOSITORY } from "./repositories.tokens.js";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository
{
    constructor(
        private prisma: PrismaService,
        @Inject(QUESTIONS_ATTACHMENTS_REPOSITORY)
        private questionAttachmentsRepository: QuestionAttachmentsRepository,
    ) {}

    async findById(id: string): Promise<Question | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                id,
            },
        })

        if (!question) {
            return null
        }

        return PrismaQuestionMapper.toDomain(question)
    }

    async findBySlug(slug: string): Promise<Question | null> {
        const question = await this.prisma.question.findUnique({
            where: {
                slug,
            },
        })

        if (!question) {
            return null
        }

        return PrismaQuestionMapper.toDomain(question)
    }

    async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
        const questions = await this.prisma.question.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        })

        return questions.map(PrismaQuestionMapper.toDomain)
    }

    async create(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question)
        
        await this.prisma.question.create({
            data,
        })

        await this.questionAttachmentsRepository.createMany(
            question.attachments.getItems(),
        )
    }

    async save(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question)

        await Promise.all([
            this.prisma.question.update({
                where: {
                    id: question.id.toString(),
                },
                data,
            }),
            this.questionAttachmentsRepository.createMany(
                question.attachments.getNewItems(),
            ),
            this.questionAttachmentsRepository.deleteMany(
                question.attachments.getRemovedItems(),
            ),
        ]) 
    }

    async delete(question: Question): Promise<void> {
        const data = PrismaQuestionMapper.toPrisma(question)

        await this.prisma.question.delete({
            where: {
                id: data.id,
            },
        })
    }
}