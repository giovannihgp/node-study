import { DeleteAnswerUseCase } from "./delete-answer.js";
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answer-repository.js";
import { makeAnswer } from "@test/factories/make-answer.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository.js";
import { makeAnswerAttachment } from "@test/factories/make-answer-attachments.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase
let prisma: PrismaService   

describe('Delete Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswerRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        sut = new DeleteAnswerUseCase(inMemoryAnswerRepository)
        prisma = new PrismaService()
    })
    beforeEach(async () => {
        await prisma.comment.deleteMany()
        await prisma.attachment.deleteMany()
        await prisma.answer.deleteMany()
        await prisma.question.deleteMany()
        await prisma.notification.deleteMany()
        await prisma.user.deleteMany()
    })


    it('should be able to delete a answer', async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityID('author-1'),
            },
            new UniqueEntityID('answer-1'),
        )

        await inMemoryAnswerRepository.create(newAnswer)

        inMemoryAnswerAttachmentsRepository.items.push(
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1'),
            }),
            makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('2'),
            }),
        )

        await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-1',
        })

        expect(inMemoryAnswerRepository.items).toHaveLength(0)
        expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete a answer from another user', async () => {
        const newAnswer = makeAnswer(
            {
                authorId: new UniqueEntityID('author-1')
            },
            new UniqueEntityID('answer-1'),
        )

        await inMemoryAnswerRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})