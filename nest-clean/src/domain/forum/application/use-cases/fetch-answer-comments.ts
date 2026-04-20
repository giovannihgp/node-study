import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js";
import { right, type Either } from "@/core/either.js";
import { Injectable, Inject } from "@nestjs/common";
import { ANSWER_COMMENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author.js";

interface FetchAnswerCommentsUseCaseRequest {
    answerId: string
    page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<null, { comments: CommentWithAuthor[] }>

@Injectable()
export class FetchAnswerCommentsUseCase {
    constructor(
        @Inject(ANSWER_COMMENTS_REPOSITORY)
        private answersCommentsRepository: AnswerCommentsRepository,
    ) {}

    async execute({
        answerId, 
        page,
    }: FetchAnswerCommentsUseCaseRequest) : Promise<FetchAnswerCommentsUseCaseResponse> {
        const comments =
          await this.answersCommentsRepository.findManyByAnswerIdWithAuthor(answerId, {
            page,
          },
        ) 
        return right({
            comments,
        })
    }
}