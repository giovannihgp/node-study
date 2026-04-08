import { QuestionComment } from "../../enterprise/entities/question-comment.js";
import { type QuestionCommentsRepository } from "../repositories/question-comments-repository.js";
import { right, type Either } from "@/core/either.js";
import { Injectable, Inject } from "@nestjs/common";
import { QUESTIONS_COMMENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";

interface FetchQuestionCommentsUseCaseRequest {
    questionId: string
    page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<null, { questionComments: QuestionComment[] }>

@Injectable()
export class FetchQuestionCommentsUseCase {
    constructor(
        @Inject(QUESTIONS_COMMENTS_REPOSITORY)
        private questionCommentsRepository: QuestionCommentsRepository,
    ) {}

    async execute({
        questionId,
        page,
    }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
        const questionComments = await this.questionCommentsRepository.findManyByQuestionId(questionId, { page, })
        
        return right({
            questionComments,
        })
    }
}