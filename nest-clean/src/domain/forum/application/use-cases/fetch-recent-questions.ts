import { Question } from "../../enterprise/entities/question.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";
import { right, type Either } from "@/core/either.js";
import { Injectable, Inject } from "@nestjs/common";
import { QUESTIONS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";

interface FetchRecentQuestionsUseCaseRequest {
    page: number
}

type FetchRecentQuestionsUseCaseResponse = Either<null, { questions: Question[] }>

@Injectable()
export class FetchRecentQuestionsUseCase {
    constructor(
        @Inject(QUESTIONS_REPOSITORY)
        private questionsRepository: QuestionsRepository,
    ) {}

    async execute({
        page,
    }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
        const questions = await this.questionsRepository.findManyRecent({ page })

        return right({
            questions,
        })
    }
}