import { PrismaService } from "@/infra/database/prisma/prisma.service.js"
import { INestApplication } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { QuestionFactory } from "@test/factories/make-question.js"
import { StudentFactory } from "@test/factories/make-student.js"
import { AppModule } from "@/infra/app.module.js"
import { DatabaseModule } from "@/infra/database/database.module.js"
import { Test } from "@nestjs/testing"
import request from 'supertest'

describe('Edit question (e2e)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[PUT] /questions/:id', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const questionId = question.id.toString()

        const response = await request(app.getHttpServer())
          .put(`/questions/${questionId}`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({
            title: 'Novo title',
            content: 'Novo content',
          })

          expect(response.statusCode).toBe(204)

          const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title: 'Novo title',
                content: 'Novo content',
            },
          })

          expect(questionOnDatabase).toBeTruthy()
    })
})