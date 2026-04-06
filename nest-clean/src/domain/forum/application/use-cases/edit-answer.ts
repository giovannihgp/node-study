import { Answer } from "../../enterprise/entities/answer.js";
import type { AnswersRepository } from "../repositories/answer-repository.js";
import { left, right, type Either } from "@/core/either.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";
import { AnswerAttachmentList } from "../../enterprise/entities/answer-attachment-list.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import type { AnswerAttachmentsRepository } from "../repositories/answer-attachments-repository.js";
import { AnswerAttachment } from "../../enterprise/entities/answer-attachment.js";
import { Injectable, Inject } from "@nestjs/common";
import { ANSWER_REPOSITORY, ANSWER_ATTACHMENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";

interface EditAnswerUseCaseRequest {
    authorId: string
    answerId: string
    content: string
    attachmentsIds: string[]
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { answer: Answer }>

@Injectable()
export class EditAnswerUseCase {
    constructor(
        @Inject(ANSWER_REPOSITORY)
        private answerRepository: AnswersRepository,
        @Inject(ANSWER_ATTACHMENTS_REPOSITORY)
        private answerAttachmentsRepository: AnswerAttachmentsRepository,
    ) {}

    async execute({
        authorId,
        answerId,
        content,
        attachmentsIds,
    }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
        const answer = await this.answerRepository.findById(answerId)

        if (!answer) {
            return left(new ResourceNotFoundError)
        }

        if (authorId !== answer.authorId.toString()) {
            return left(new NotAllowedError)
        }

        const currentAnswerAttachments = 
          await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

        const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

        const answerAttachments = attachmentsIds.map((attachmentsId) => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityID(attachmentsId),
                answerId: answer.id,
            })
        })

        answerAttachmentList.update(answerAttachments)

        answer.attachments = answerAttachmentList
        answer.content = content

        await this.answerRepository.save(answer)

        return right({
            answer,
        })
    }
}