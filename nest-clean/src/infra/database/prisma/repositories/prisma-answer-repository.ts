import { PaginationParams } from "@/core/repositories/pagination-params.js";
import { AnswersRepository } from "@/domain/forum/application/repositories/answer-repository.js";
import { Answer } from "@/domain/forum/enterprise/entities/answer.js";
import { Injectable, Inject } from "@nestjs/common";
import { PrismaService } from "../prisma.service.js";
import { PrismaAnswerMapper } from "../mappers/prisma-answer-mapper.js";
import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository.js";
import { ANSWER_ATTACHMENTS_REPOSITORY } from "./repositories.tokens.js";
import { DomainEvents } from "@/core/events/domain-events.js";

@Injectable()
export class PrismaAnswerRepository implements AnswersRepository
{
    constructor(
        private prisma: PrismaService,
        @Inject(ANSWER_ATTACHMENTS_REPOSITORY)
        private answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) {}

    async findById(id: string): Promise<Answer | null> {
        const answer = await this.prisma.answer.findUnique({
            where: {
                id,
            },
        })

        if (!answer) {
            return null
        }

        return PrismaAnswerMapper.toDomain(answer)
    }

    async findManyByQuestionId(
        questionId: string, 
        { page }: PaginationParams,
    ): Promise<Answer[]> {
        const answers = await this.prisma.answer.findMany({
            where: {
                questionId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page - 1) * 20,
        })

        return answers.map(PrismaAnswerMapper.toDomain)
    }

    async create(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPrisma(answer)

        await this.prisma.answer.create({
            data,
        })

        await this.answerAttachmentsRepository.createMany(
            answer.attachments.getItems(),
        )

        DomainEvents.dispatchEventsForAggregate(answer.id)
    }

    async save(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPrisma(answer)

        await Promise.all([
            this.prisma.answer.update({
                where: {
                    id: answer.id.toString(),
                },
                data,
            }),
            this.answerAttachmentsRepository.createMany(
                answer.attachments.getNewItems(),
            ),
            this.answerAttachmentsRepository.deleteMany(
                answer.attachments.getRemovedItems(),
            ),
        ])

        DomainEvents.dispatchEventsForAggregate(answer.id)
    }

    async delete(answer: Answer): Promise<void> {
        await this.prisma.answer.delete({
            where: {
                id: answer.id.toString(),
            },
        })        
    }
}