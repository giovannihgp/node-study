import { faker } from "@faker-js/faker";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { Notification, type NotificationProps } from "@/domain/notification/enterprise/entities/notification.js";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service.js";
import { PrismaNotificationMapper } from "@/infra/database/prisma/mappers/prisma-notification-mapper.js";

export function makeNotification(
    override: Partial<NotificationProps> = {},
    id?: UniqueEntityID,
) {
    const notification = Notification.create(
        {
            recipientId: new UniqueEntityID(),
            title: faker.lorem.sentence(),
            content: faker.lorem.text(),
            ...override,
        },
        id,
    )

    return notification
}

@Injectable()
export class NotificationFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaNotification(
        data: Partial<NotificationProps> = {},
    ): Promise<Notification> {
        const notification = makeNotification(data)

        await this.prisma.notification.create({
            data: PrismaNotificationMapper.toPrisma(notification),
        })

        return notification
    }
}