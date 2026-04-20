import { GetQuestionBySlugUseCase } from "./get-question-by-slug.js";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository.js";
import { Slug } from "../../enterprise/entities/value-objects/slug.js";
import { makeQuestion } from "@test/factories/make-question.js";
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository.js";
import { InMemoryAttachmentsRepository } from "@test/repositories/in-memory-attachments-repository.js";
import { InMemoryStudentsRepository } from "@test/repositories/in-memory-students-repository.js";
import { makeStudent } from "@test/factories/make-student.js";
import { makeAttachment } from "@test/factories/make-attachment.js";
import { makeQuestionAttachment } from "@test/factories/make-question-attachments.js";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question by Slug', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
            inMemoryQuestionAttachmentsRepository,
            inMemoryAttachmentsRepository,
            inMemoryStudentsRepository,
        )
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to get a question by slug', async () => {
        const student = makeStudent({ name: 'Gio H' })

        await inMemoryStudentsRepository.create(student)

        const newQuestion = makeQuestion({
            authorId: student.id,
            slug: Slug.create('example-question'),
        })

        await inMemoryQuestionsRepository.create(newQuestion)

        const attachment = makeAttachment({
            title: 'Some attachment',
        })

        inMemoryAttachmentsRepository.items.push(attachment)

        inMemoryQuestionAttachmentsRepository.items.push(
            makeQuestionAttachment({
                attachmentId: attachment.id,
                questionId: newQuestion.id,
            }),
        )

        const result = await sut.execute({
            slug: 'example-question',
        })

        expect(result.value).toMatchObject({
            question: expect.objectContaining({
                title: newQuestion.title,
                author: 'Gio H',
                attachments: [
                    expect.objectContaining({
                        title: attachment.title,
                    }),
                ],
            }),
        })
    })
})