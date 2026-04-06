import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { AnswerComment, type AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comment.js";
import { PrismaAnswerCommentMapper } from "@/infra/database/prisma/mappers/prisma-answer-comment-mapper.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";
import { Injectable } from "@nestjs/common";

export function makeAnswersComment(
    override: Partial<AnswerCommentProps> = {},
    id?: UniqueEntityID,
) {
    const answers = AnswerComment.create(
        {
            authorId: new UniqueEntityID(),
            answerId: new UniqueEntityID(),
            content: faker.lorem.text(),
            ...override,
        },
        id,
    )

    return answers
}

@Injectable()
export class AnswerCommentFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaAnswerComment(
        data: Partial<AnswerCommentProps> = {},
    ): Promise<AnswerComment> {
        const answerComment = makeAnswersComment(data)

        await this.prisma.comment.create({
            data: PrismaAnswerCommentMapper.toPrisma(answerComment),
        })

        return answerComment
    }
}