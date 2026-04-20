import { InMemoryAnswerCommentsRepository } from "@test/repositories/in-memory-answer-comments-repository.js";
import { DeleteAnswerCommentUseCase } from "./delete-answer-comment.js";
import { makeAnswersComment } from "@test/factories/make-answer-comment.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";
import { InMemoryStudentsRepository } from "@test/repositories/in-memory-students-repository.js";

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let sut: DeleteAnswerCommentUseCase

describe('Delete Answer Comment', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository)
        sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
    })

    it('should be able to delete a answer comment', async () => {
        const answerComment = makeAnswersComment()

        await inMemoryAnswerCommentsRepository.create(answerComment)

        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        })

        expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete another user answer comment', async () => {
        const answerComment = makeAnswersComment({
            authorId: new UniqueEntityID('author-1'),
        })

        await inMemoryAnswerCommentsRepository.create(answerComment)

        const result = await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})