import { Injectable, Inject } from "@nestjs/common";
import { Question } from "../../enterprise/entities/question.js";
import type { QuestionsRepository } from "../repositories/questions-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { QUESTIONS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";

interface GetQuestionBySlugUseCaseRequest {
    slug: string
}

type GetQuestionBySlugUseCaseResponse = Either<ResourceNotFoundError, { question: Question }>

@Injectable()
export class GetQuestionBySlugUseCase {
    constructor(
        @Inject(QUESTIONS_REPOSITORY)
        private questionsRepository: QuestionsRepository,
    ) {}

    async execute({
        slug,
    }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
        const question = await this.questionsRepository.findBySlug(slug)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        return right({
            question,
        })
    }
}