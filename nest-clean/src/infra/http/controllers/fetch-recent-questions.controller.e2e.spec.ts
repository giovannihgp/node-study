import { AppModule } from "@/infra/app.module.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { randomUUID } from "crypto";

describe('Fetch recent questions (e2e)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService

    async function clearDatabase() {
        await prisma.question.deleteMany()
    }

    beforeEach(async () => {
        await clearDatabase()
    })

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[GET] /questions', async () => {
        const email = `user-${randomUUID()}@test.com`
        const user = await prisma.user.create({
            data: {
                name: 'Giovanni Henrique',
                email,
                password: '123456',
            },
        })

        const accessToken = jwt.sign({ sub: user.id })

        await prisma.question.createMany({
            data: [
                {
                    title: 'Question 01',
                    slug: `question-01-${randomUUID()}`,
                    content: 'Question content',
                    authorId: user.id,
                },
                {
                    title: 'Question 02',
                    slug: `question-02-${randomUUID()}`,
                    content: 'Question content',
                    authorId: user.id,
                },
            ],
        })

        const response = await request(app.getHttpServer())
            .get('/questions')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            questions: [
                expect.objectContaining({ title: 'Question 01' }),
                expect.objectContaining({ title: 'Question 02' }),
            ],
        })
    })
})