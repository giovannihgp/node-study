import { AnswerComment } from "../../enterprise/entities/answer-comment.js";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js";
import { right, type Either } from "@/core/either.js";
import { Injectable, Inject } from "@nestjs/common";
import { ANSWER_COMMENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";

interface FetchAnswerCommentsUseCaseRequest {
    answerId: string
    page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<null, { answerComments: AnswerComment[] }>

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
        const answerComments =
          await this.answersCommentsRepository.findManyByAnswerId(answerId, {
            page,
          }) 
        return right({
            answerComments,
        })
    }
}