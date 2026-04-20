import { Injectable, Inject } from "@nestjs/common";
import type { QuestionsRepository } from "../repositories/questions-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { QUESTIONS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";
import { QuestionDetails } from "../../enterprise/entities/value-objects/question-detail.js";

interface GetQuestionBySlugUseCaseRequest {
    slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<
    ResourceNotFoundError, 
    { 
        question: QuestionDetails 
    }
>

@Injectable()
export class GetQuestionBySlugUseCase {
    constructor(
        @Inject(QUESTIONS_REPOSITORY)
        private questionsRepository: QuestionsRepository,
    ) {}

    async execute({
        slug,
    }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
        const question = await this.questionsRepository.findDetailsBySlug(slug)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        return right({
            question,
        })
    }
}