import { AppModule } from "@/infra/app.module.js";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { QuestionFactory } from "test/factories/make-question.js";
import { StudentFactory } from "test/factories/make-student.js";
import { QuestionCommentFactory } from "test/factories/make-question-comment.js";

describe('Delete question comment (e2e)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let questionCommentFactory: QuestionCommentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        questionCommentFactory = moduleRef.get(QuestionCommentFactory)
        jwt = moduleRef.get(JwtService)

        app.init()
    })

    test('[DELETE] /questions/comments/:id', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
        })

        const questionComment =
          await questionCommentFactory.makePrismaQuestionComment({
            authorId: user.id,
            questionId: question.id,
          })

        const questionCommentId = questionComment.id.toString()

        const response = await request(app.getHttpServer())
          .delete(`/questions/comments/${questionCommentId}`)
          .set('Authorization', `Bearer ${accessToken}`)

        expect(response.statusCode).toBe(204)

        const commentOnDatabase = await prisma.comment.findUnique({
            where: {
                id: questionCommentId,
            },
        })

        expect(commentOnDatabase).toBeNull()
    })
})