import { UniqueEntityID } from "@/core/entities/unique-entity-id.js"
import { InMemoryAnswerCommentsRepository } from "@test/repositories/in-memory-answer-comments-repository.js"
import { FetchAnswerCommentsUseCase } from "./fetch-answer-comments.js"
import { makeAnswersComment } from "@test/factories/make-answer-comment.js"
import { InMemoryStudentsRepository } from "@test/repositories/in-memory-students-repository.js"
import { makeStudent } from "@test/factories/make-student.js"

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: FetchAnswerCommentsUseCase

describe('Fetch Answer Comments', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository)
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository)
    })

    it('should be able to fetch answer comments', async () => {
        const student = makeStudent({ name: 'Gio H' })

        inMemoryStudentsRepository.items.push(student)

        const comment1 = makeAnswersComment({ 
            answerId: new UniqueEntityID('answer-1'),
            authorId: student.id,
        })

        const comment2 = makeAnswersComment({ 
            answerId: new UniqueEntityID('answer-1'),
            authorId: student.id,
        })

        const comment3 = makeAnswersComment({ 
            answerId: new UniqueEntityID('answer-1'),
            authorId: student.id,
        })

        await inMemoryAnswerCommentsRepository.create(comment1)
        await inMemoryAnswerCommentsRepository.create(comment2)
        await inMemoryAnswerCommentsRepository.create(comment3)

        const result = await sut.execute({
            answerId: 'answer-1',
            page: 1,
        })

        expect(result.value?.comments).toHaveLength(3)
        expect(result.value?.comments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    author: 'Gio H',
                    commentId: comment1.id,
                }),
                expect.objectContaining({
                    author: 'Gio H',
                    commentId: comment2.id,
                }),
                expect.objectContaining({
                    author: 'Gio H',
                    commentId: comment3.id,
                }),
            ]),
        )
    })

    it('should be able to fetch paginated answer comments', async () => {
        const student = makeStudent({ name: 'Gio H' })

        inMemoryStudentsRepository.items.push(student)

        for (let i = 1; i <= 22; i++) {
            await inMemoryAnswerCommentsRepository.create(makeAnswersComment({
                answerId: new UniqueEntityID('answer-1'),
                authorId: student.id,
            }),)
        }

        const result = await sut.execute({
            answerId: 'answer-1',
            page: 2,
        })

        expect(result.value?.comments).toHaveLength(2)
    })
})