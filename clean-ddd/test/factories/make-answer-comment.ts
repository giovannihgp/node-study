import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { AnswerComment, type AnswerCommentProps } from "@/domain/forum/enterprise/entities/answer-comment.js";

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