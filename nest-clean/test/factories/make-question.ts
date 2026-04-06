import { faker} from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { Question, type QuestionProps } from "@/domain/forum/enterprise/entities/question.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";
import { PrismaQuestionMapper } from "@/infra/database/prisma/mappers/prisma-question-mapper.js";
import { Injectable } from "@nestjs/common";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug.js";

export function makeQuestion(
    override: Partial<QuestionProps> = {},
    id?: UniqueEntityID,
) {
    const title = override.title ?? faker.lorem.sentence()
    
    const question = Question.create(
        {
            authorId: override.authorId ?? new UniqueEntityID(),
            title,
            content: faker.lorem.text(),
            slug: Slug.createFromText(title + '-' + faker.string.uuid()),
            ...override,
        },
        id,
    )

    return question
}

@Injectable()
export class QuestionFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaQuestion(
        data: Partial<QuestionProps> = {},
    ): Promise<Question> {
        const question = makeQuestion(data)

        await this.prisma.question.create({
            data: PrismaQuestionMapper.toPrisma(question),
        })

        return question
    }
}