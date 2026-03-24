import { left, right, type Either } from "@/core/either.js";
import type { AnswersRepository } from "../repositories/answer-repository.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";

interface DeleteAnswerUseCaseRequest {
    authorId: string
    answerId: string
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, null>

export class DeleteAnswerUseCase {
    constructor(private answerRepository: AnswersRepository) {}

    async execute({
        answerId,
        authorId,
    }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError())
        }

        await this.answerRepository.delete(answer)

        return right(null)
    }
}