import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository.js";
import { AppModule } from "@/infra/app.module.js";
import { CacheRepository } from "@/infra/cache/cache-repository.js";
import { CacheModule } from "@/infra/cache/cache.module.js";
import { DatabaseModule } from "../../database.module.js";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AttachmentFactory } from "@test/factories/make-attachment.js";
import { QuestionFactory } from "@test/factories/make-question.js";
import { QuestionAttachmentFactory } from "@test/factories/make-question-attachments.js";
import { StudentFactory } from "@test/factories/make-student.js";
import { 
    QUESTIONS_REPOSITORY,
    CACHE_REPOSITORY,
} from "./repositories.tokens.js";

describe('Prisma Questions Repository (e2e)', () => {
    let app: INestApplication
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let attachmentFactory: AttachmentFactory
    let questionAttachmentFactory: QuestionAttachmentFactory
    let cacheRepository: CacheRepository
    let questionsRepository: QuestionsRepository

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule, CacheModule],
            providers: [
                StudentFactory,
                QuestionFactory,
                AttachmentFactory,
                QuestionAttachmentFactory,
            ],
        }).compile()

        app = moduleRef.createNestApplication()

        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        attachmentFactory = moduleRef.get(AttachmentFactory)
        questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
        cacheRepository = moduleRef.get(CACHE_REPOSITORY)
        questionsRepository = moduleRef.get(QUESTIONS_REPOSITORY)

        await app.init()
    })

    it('should cache question details', async () => {
        const user = await studentFactory.makePrismaStudent()

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const attachment = await attachmentFactory.makePrismaAttachment()

        await questionAttachmentFactory.makePrismaQuestionAttachment({
            attachmentId: attachment.id,
            questionId: question.id,
        })

        const slug = question.slug.value

        const questionDetails = await questionsRepository.findDetailsBySlug(slug)

        const cached = await cacheRepository.get(`question:${slug}:details`)

        if (!cached) {
            throw new Error()
        }

        expect(JSON.parse(cached)).toEqual(
            expect.objectContaining({
                id: questionDetails?.questionId.toString(),
            }),
        )
    })

    it('should return cached question details on subsequent calls', async () => {
        const user = await studentFactory.makePrismaStudent()

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const attachment = await attachmentFactory.makePrismaAttachment()

        await questionAttachmentFactory.makePrismaQuestionAttachment({
            attachmentId: attachment.id,
            questionId: question.id,
        })

        const slug = question.slug.value

        let cached = await cacheRepository.get(`question:${slug}:details`)

        expect(cached).toBeNull()

        await questionsRepository.findDetailsBySlug(slug)

        cached = await cacheRepository.get(`question:${slug}:details`)

        expect(cached).not.toBeNull()

        const questionDetails = await questionsRepository.findDetailsBySlug(slug)

        if (!cached) {
            throw new Error()
        }

        expect(JSON.parse(cached)).toEqual(
            expect.objectContaining({
                id: questionDetails?.questionId.toString(),
            }),
        )
    })

    it('should reset question details cache when saving the question', async () => {
        const user = await studentFactory.makePrismaStudent()

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const attachment = await attachmentFactory.makePrismaAttachment()

        await questionAttachmentFactory.makePrismaQuestionAttachment({
            attachmentId: attachment.id,
            questionId: question.id,
        })

        const slug = question.slug.value

        await cacheRepository.set(
            `question:${slug}:details`,
            JSON.stringify({ empty: true }),
        )

        await questionsRepository.save(question)

        const cached = await cacheRepository.get(`question:${slug}:details`)

        expect(cached).toBeNull()
    })
})