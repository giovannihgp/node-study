import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment.js";
import { Comment as PrismaComment, Prisma } from "@prisma/client";

export class PrismaQuestionCommentMapper {
    static toDomain(raw: PrismaComment): QuestionComment {
        if (!raw.questionId) {
            throw new Error('Invalid attachment type')
        }

        return QuestionComment.create(
            {
                content: raw.content,
                authorId: new UniqueEntityID(raw.authorId),
                questionId: new UniqueEntityID(raw.questionId),
                createdAt: raw.createdAt,
                updatedAt: raw.updatedAt,
            },
            new UniqueEntityID(raw.id)
        )
    }

    static toPrisma(
        questionComment: QuestionComment,
    ): Prisma.CommentUncheckedCreateInput {
        return {
            id: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
            questionId: questionComment.questionId.toString(),
            content: questionComment.content,
            createdAt: questionComment.createdAt,
            updatedAt: questionComment.updatedAt,
        }
    }
}