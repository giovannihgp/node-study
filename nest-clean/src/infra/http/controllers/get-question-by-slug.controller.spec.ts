import { AppModule } from "@/infra/app.module.js";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug.js";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { QuestionFactory } from "test/factories/make-question.js";
import { StudentFactory } from "test/factories/make-student.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";

describe('Get question by slug (e2e)', () => {
    let app: INestApplication 
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory],
        }).compile()

        app = moduleRef.createNestApplication()

        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[GET] /questions/:slug', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: new UniqueEntityID(user.id.toString()),
            title: 'Question 01',
            slug: Slug.create(`question-01-${crypto.randomUUID()}`),
        })

        const response = await request(app.getHttpServer())
          .get(`/questions/${question.slug.value}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()
          
        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            question: expect.objectContaining({ title: 'Question 01'}),
        })
    })
})