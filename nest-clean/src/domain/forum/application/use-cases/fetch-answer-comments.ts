import { AnswerComment } from "../../enterprise/entities/answer-comment.js";
import type { AnswerCommentsRepository } from "../repositories/answer-comments-repository.js";
import { right, type Either } from "@/core/either.js";

interface FetchAnswerCommentsUseCaseRequest {
    answerId: string
    page: number
}

type FetchAnswerCommentsUseCaseResponse = Either<null, { answerComments: AnswerComment[] }>

export class FetchAnswerCommentsUseCase {
    constructor(private answersCommentsRepository: AnswerCommentsRepository) {}

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