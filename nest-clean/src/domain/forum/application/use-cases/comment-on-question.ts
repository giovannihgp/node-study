import type { QuestionsRepository } from "../repositories/questions-repository.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { QuestionComment } from "../../enterprise/entities/question-comment.js";
import type { QuestionCommentsRepository } from "../repositories/question-comments-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { Injectable, Inject } from "@nestjs/common";
import { QUESTIONS_REPOSITORY, QUESTIONS_COMMENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";

interface CommentOnQuestionUseCaseRequest {
    authorId: string
    questionId: string
    content: string
}

type CommentOnQuestionUseCaseResponse = Either<ResourceNotFoundError, { questionComment: QuestionComment }>

@Injectable()
export class CommentOnQuestionUseCase {
    constructor(
        @Inject(QUESTIONS_REPOSITORY)
        private questionsRepository: QuestionsRepository,
        @Inject(QUESTIONS_COMMENTS_REPOSITORY)
        private questionCommentsRepository: QuestionCommentsRepository,
    ) {}

    async execute({
        authorId,
        questionId,
        content,
    }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        const questionComment = QuestionComment.create({
            authorId: new UniqueEntityID(authorId),
            questionId: new UniqueEntityID(questionId),
            content,
        })

        await this.questionCommentsRepository.create(questionComment)

        return right({
            questionComment,
        })
    }
}