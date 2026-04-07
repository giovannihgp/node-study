import { AppModule } from "@/infra/app.module.js";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { hash } from "bcryptjs";
import request from "supertest";
import { randomUUID } from "crypto";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { StudentFactory } from "@test/factories/make-student.js";

describe('Authenticate (e2e)', () => {
    let app: INestApplication
    let studentFactory: StudentFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory],
        }).compile()

        app = moduleRef.createNestApplication()

        studentFactory = moduleRef.get(StudentFactory)

        await app.init()
    })

    test('[POST] /sessions', async () => {
        const email = `user-${randomUUID()}@test.com`
        await studentFactory.makePrismaStudent({
            email,
            password: await hash('123456', 8),
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