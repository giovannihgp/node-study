import { left, right, type Either } from "@/core/either.js";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { Injectable, Inject } from "@nestjs/common";
import { ANSWER_COMMENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";

interface DeleteAnswerCommentUseCaseRequest {
    authorId: string
    answerCommentId: string
}

type DeleteAnswerCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>

@Injectable()
export class DeleteAnswerCommentUseCase {
    constructor(
        @Inject(ANSWER_COMMENTS_REPOSITORY)
        private answerCommentsRepository: AnswerCommentsRepository
    ) {}

    async execute({
        authorId,
        answerCommentId,
    }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
        const answerComment = await this.answerCommentsRepository.findById(
            answerCommentId,
        )

        if (!answerComment) {
            return left(new ResourceNotFoundError())
        }

        if (answerComment.authorId.toString() !== authorId) {
            return left(new NotAllowedError())
        }

        await this.answerCommentsRepository.delete(answerComment)

        return right(null)
    }
}