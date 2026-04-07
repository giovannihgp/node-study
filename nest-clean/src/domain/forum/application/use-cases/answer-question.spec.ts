import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { AnswerQuestionUseCase } from "./answer-question.js";
import { InMemoryAnswerAttachmentsRepository } from "@test/repositories/in-memory-answer-attachments-repository.js";
import { InMemoryAnswersRepository } from "@test/repositories/in-memory-answer-repository.js";

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Create Answer', () => {
    beforeEach(() => {
        inMemoryAnswerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswerAttachmentsRepository)
        sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
    })

    it('should be able to create a answer', async () => {
        const result = await sut.execute({
            questionId: '1',
            authorId: '1',
            content: 'Conteúdo da resposta',
            attachmentsIds: ['1', '2'],
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer)
        expect(inMemoryAnswersRepository.items[0]?.attachments.currentItems).toHaveLength(2)
        expect(inMemoryAnswersRepository.items[0]?.attachments.currentItems).toEqual(
            [
                expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
                expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
            ],
        )
    })
})