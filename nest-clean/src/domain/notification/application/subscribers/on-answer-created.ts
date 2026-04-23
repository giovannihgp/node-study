import type { EventHandler } from "@/core/events/event-handler.js";
import { DomainEvents } from "@/core/events/domain-events.js";
import { AnswerCreateEvent } from "@/domain/forum/enterprise/events/answer-created-event.js";
import type { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository.js";
import { SendNotificationUseCase } from "../use-case/send-notifications.js";
import { Injectable, Inject } from "@nestjs/common";
import { QUESTIONS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";

@Injectable()
export class OnAnswerCreated implements EventHandler {
    constructor(
        @Inject(QUESTIONS_REPOSITORY)
        private questionsRepository: QuestionsRepository,
        private sendNotification: SendNotificationUseCase,
    ) {
        this.setupSubscriptions()
    }

    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewAnswerNotification.bind(this),
            AnswerCreateEvent.name,
        )
    }

    private async sendNewAnswerNotification({ answer }: AnswerCreateEvent) {
        const question = await this.questionsRepository.findById(
            answer.questionId.toString(),
        )

        if (question) {
            await this.sendNotification.execute({
                recipientId: question.authorId.toString(),
                title: `Nova resposta em "${question.title
                  .substring(0, 40)
                  .concat('...')}"`,
                content: answer.excerpt,
            })
        }
    }
}