import { AppModule } from "@/infra/app.module.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { randomUUID } from "crypto";

describe('Authenticate (e2e)', () => {
    let app: INestApplication
    let prisma: PrismaService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)

        await app.init()
    })

    test('[POST] /sessions', async () => {
        const email = `user-${randomUUID()}@test.com`
        await prisma.user.create({
            data: {
                name: 'Giovanni Henrique',
                email,
                password: await hash('123456', 8),
            },
        })

        const response = await request(app.getHttpServer()).post('/sessions').send({
            email,
            password: '123456',
        })

        expect(response.statusCode).toBe(201)
        expect(response.body).toEqual({
            access_token: expect.any(String),
        })
    })
})