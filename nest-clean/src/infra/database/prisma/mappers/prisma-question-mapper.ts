import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { Question } from "@/domain/forum/enterprise/entities/question.js";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug.js";
import { Question as PrismaQuestion, Prisma } from "@prisma/client";

export class PrismaQuestionMapper {
    static toDomain(raw: PrismaQuestion): Question {
        return Question.create(
            {
                title: raw.title,
                content: raw.content,
                authorId: new UniqueEntityID(raw.authorId),
                bestAnswerId: raw.bestAnswerId
                  ? new UniqueEntityID(raw.bestAnswerId)
                  : null,
                slug: Slug.create(raw.slug),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityID(raw.id),
        )
    }

    static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
        return {
            id: question.id.toString(),
            authorId: question.authorId.toString(),
            bestAnswerId: question.bestAnswerId?.toString(),
            title: question.title,
            content: question.content,
            slug: question.slug.value,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        }
    }
}