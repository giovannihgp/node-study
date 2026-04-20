import { EditQuestionUseCase } from "./edit-question.js";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository.js";
import { makeQuestion } from "@test/factories/make-question.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository.js";
import { makeQuestionAttachment } from "@test/factories/make-question-attachments.js";
import { InMemoryAttachmentsRepository } from "@test/repositories/in-memory-attachments-repository.js";
import { InMemoryStudentsRepository } from "@test/repositories/in-memory-students-repository.js";

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepository,
            inMemoryAttachmentsRepository,
            inMemoryStudentsRepository,
        )
        sut = new EditQuestionUseCase(
            inMemoryQuestionsRepository,
            inMemoryQuestionAttachmentsRepository
        )
    })

    it('should be able to edit a question', async () => {
        const newQuestion = makeQuestion(
            {
                authorId: new UniqueEntityID('author-01'),
            },
            new UniqueEntityID('question-1'),
        )

        await inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestionAttachmentsRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('1'),
            }),
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('2'),
            }),
        )

        await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-01',
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
            attachmentsIds: ['1', '3'],
        })

        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
        })

        expect(
            inMemoryQuestionsRepository.items[0].attachments.currentItems,
        ).toHaveLength(2)
        expect(
            inMemoryQuestionsRepository.items[0].attachments.currentItems,
        ).toEqual([
            expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
            expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
        ])
    })

    it('should not be able to edit a question from another user', async () => {
        const newQuestion = makeQuestion(
            {
                authorId: new UniqueEntityID('author-01'),
            },
            new UniqueEntityID('question-1'),
        )

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-02',
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
            attachmentsIds: [],
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })

    it('should sync new and removed attachment when editing a question', async () => {
        const newQuestion = makeQuestion(
            {
                authorId: new UniqueEntityID('author-1'),
            },
            new UniqueEntityID('question-1'),
        )

        await inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestionAttachmentsRepository.items.push(
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('1'),
            }),
            makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('2'),
            }),
        )

        const result = await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-1',
            title: 'Pergunta teste',
            content: 'Conteúdo teste',
            attachmentsIds: ['1', '3'],
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
        expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    attachmentId: new UniqueEntityID('1'),
                }),
                expect.objectContaining({ 
                    attachmentId: new UniqueEntityID('3') 
                }),
            ]),
        )
    })
})