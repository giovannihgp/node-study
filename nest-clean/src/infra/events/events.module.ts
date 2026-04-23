import { Module } from "@nestjs/common";
import { OnAnswerCreated } from "@/domain/notification/application/subscribers/on-answer-created.js";
import { OnQuestionBestAnswerChosen } from "@/domain/notification/application/subscribers/on-question-best-answer-chosen.js";
import { SendNotificationUseCase } from "@/domain/notification/application/use-case/send-notifications.js";
import { DatabaseModule } from "../database/database.module.js";

@Module({
    imports: [DatabaseModule],
    providers: [
        OnAnswerCreated,
        OnQuestionBestAnswerChosen,
        SendNotificationUseCase,
    ],
})
export class EventsModule {}