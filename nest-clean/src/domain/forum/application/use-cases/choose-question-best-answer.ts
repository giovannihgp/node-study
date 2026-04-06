import type { AnswersRepository } from "../repositories/answer-repository.js";
import { Question } from "../../enterprise/entities/question.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";
import { Injectable, Inject } from "@nestjs/common";
import { ANSWER_REPOSITORY, QUESTIONS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";

interface ChooseQuestionBestAnswerUseCaseRequest {
    authorId: string
    answerId: string
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { question: Question }>

@Injectable()
export class ChooseQuestionBestAnswerUseCase {
    constructor(
        @Inject(QUESTIONS_REPOSITORY)
        private questionsRepository: QuestionsRepository,
        @Inject(ANSWER_REPOSITORY)
        private answersRepository: AnswersRepository, 
    ) {}

    async execute({
        answerId,
        authorId,
    }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        const question = await this.questionsRepository.findById(
            answer.questionId.toString(),
        )

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString()) {
            return left(new NotAllowedError())
        }

        question.bestAnswerId = answer.id

        await this.questionsRepository.save(question)

        return right({
            question,
        })
    }
}