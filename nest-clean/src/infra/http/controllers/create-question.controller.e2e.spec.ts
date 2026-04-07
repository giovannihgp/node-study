import { AppModule } from "@/infra/app.module.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { randomUUID } from "crypto";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { StudentFactory } from "@test/factories/make-student.js";

describe('Create question (e2e)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let studentFactory: StudentFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[POST] /questions', async () => {
        const user = await studentFactory.makePrismaStudent()

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const title = `New question ${randomUUID()}`
        const response = await request(app.getHttpServer())
            .post('/questions')
            .set('Authorization', `Bearer ${accessToken}`)
            .send({
                title,
                content: 'Question content'
            })

        expect(response.statusCode).toBe(201)

        const questionOnDatabase = await prisma.question.findFirst({
            where: {
                title,
            },
        })

        expect(questionOnDatabase).toBeTruthy()
    })
})