import { AppModule } from "@/infra/app.module.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { randomUUID } from "crypto";

describe('Create Account (e2e)', () => {
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

    test('[POST] /accounts', async () => {
        const email = `giovanni-${randomUUID()}@gazin.com.br`

        const response = await request(app.getHttpServer())
            .post('/accounts')
            .send({
                name: 'Giovanni O Cara',
                email,
                password: '123456',
            })

        expect(response.statusCode).toBe(201)

        const userOnDatabase = await prisma.user.findUnique({
            where: {
                email,
            },
        })

        expect(userOnDatabase).toBeTruthy()
    })
})