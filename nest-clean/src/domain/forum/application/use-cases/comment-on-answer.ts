import type { AnswersRepository } from "../repositories/answer-repository.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { AnswerComment } from "../../enterprise/entities/answer-comment.js";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { Injectable, Inject } from "@nestjs/common";
import { ANSWER_REPOSITORY, ANSWER_COMMENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";

interface CommentOnAnswerUseCaseRequest {
    authorId: string
    answerId: string
    content: string
}

type CommentOnAnswerUseCaseResponse = Either<ResourceNotFoundError, { answerComment: AnswerComment }>

@Injectable()
export class CommentOnAnswerUseCase {
    constructor(
        @Inject(ANSWER_REPOSITORY)
        private answersRepository: AnswersRepository,
        @Inject(ANSWER_COMMENTS_REPOSITORY)
        private answerCommentRepository: AnswerCommentsRepository,
    ) {}

    async execute({
        authorId,
        answerId,
        content,
    }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        const answerComment = AnswerComment.create({
            authorId: new UniqueEntityID(authorId),
            answerId: new UniqueEntityID(answerId),
            content,
        })

        await this.answerCommentRepository.create(answerComment)

        return right({
            answerComment,
        })
    }
}