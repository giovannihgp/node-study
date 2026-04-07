import { GetQuestionBySlugUseCase } from "./get-question-by-slug.js";
import { InMemoryQuestionsRepository } from "@test/repositories/in-memory-questions-repository.js";
import { Slug } from "../../enterprise/entities/value-objects/slug.js";
import { makeQuestion } from "@test/factories/make-question.js";
import { InMemoryQuestionAttachmentsRepository } from "@test/repositories/in-memory-question-attachments-repository.js";

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question by Slug', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentsRepository)
        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })

    it('should be able to get a question by slug', async () => {
        const newQuestion = makeQuestion({
            slug: Slug.create('example-question'),
        })

        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            slug: 'example-question',
        })

        expect(result.value).toMatchObject({
            question: expect.objectContaining({
                title: newQuestion.title,
            }),
        })
    })
})