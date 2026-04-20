import { type QuestionCommentsRepository } from "../repositories/question-comments-repository.js";
import { right, type Either } from "@/core/either.js";
import { Injectable, Inject } from "@nestjs/common";
import { QUESTIONS_COMMENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";
import { CommentWithAuthor } from "../../enterprise/entities/value-objects/comment-with-author.js";

interface FetchQuestionCommentsUseCaseRequest {
    questionId: string
    page: number
}

type FetchQuestionCommentsUseCaseResponse = Either<
    null, 
    { 
        comments: CommentWithAuthor[] 
    }
>

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
        const comments = 
          await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
            questionId, 
            { page, }
        )
        
        return right({
            comments,
        })
    }
}