import { UniqueEntityID } from '@/core/entities/unique-entity-id.js'
import { right, type Either } from '@/core/either.js'
import { Notification } from '../../enterprise/entities/notification.js'
import { type NotificationsRepository } from '../repositories/notifications-repository.js'
import { Injectable, Inject } from '@nestjs/common'
import { NOTIFICATIONS_REPOSITORY } from '@/infra/database/prisma/repositories/repositories.tokens.js'

export interface SendNotificationUseCaseRequest {
    recipientId: string
    title: string
    content: string
}

export type SendNotificationUseCaseResponse = Either<null, { notification: Notification }>

@Injectable()
export class SendNotificationUseCase {
    constructor(
        @Inject(NOTIFICATIONS_REPOSITORY)
        private notificationsRepository: NotificationsRepository
    ) { }

    async execute({
        recipientId,
        title,
        content,
    }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
        const notification = Notification.create({
            recipientId: new UniqueEntityID(recipientId),
            title,
            content,
        })

        await this.notificationsRepository.create(notification)

        return right({
            notification,
        })
    }
}