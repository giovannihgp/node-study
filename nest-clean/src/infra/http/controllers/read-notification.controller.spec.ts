import { AppModule } from "@/infra/app.module.js";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";
import { INestApplication } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { NotificationFactory } from "@test/factories/make-notification.js";
import { StudentFactory } from "@test/factories/make-student.js";

describe('Read notification (e2e)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let studentFactory: StudentFactory
    let notificationFactory: NotificationFactory
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, NotificationFactory],
        }).compile()

        app = moduleRef.createNestApplication()
        prisma = moduleRef.get(PrismaService)
        studentFactory = moduleRef.get(StudentFactory)
        notificationFactory = moduleRef.get(NotificationFactory)
        jwt = moduleRef.get(JwtService)

        await app.init()
    })

    test('[PATCH] /notifications/:notificationId/read', async () => {
        const user = await studentFactory.makePrismaStudent({
            name: 'Gio H',
        })

        const accessToken = jwt.sign({ sub: user.id.toString() })

        const notification = await notificationFactory.makePrismaNotification({
            recipientId: user.id,
        })

        const notificationId = notification.id.toString()

        const response = await request(app.getHttpServer())
          .patch(`/notifications/${notificationId}/read`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send()

        expect(response.statusCode).toBe(204)

        const notificationOnDatabase = await prisma.notification.findFirst({
            where: {
                recipientId: user.id.toString(),
            },
        })

        expect(notificationOnDatabase?.readAt).not.toBeNull()
    })
})