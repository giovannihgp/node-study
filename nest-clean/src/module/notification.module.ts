import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { AuthModule } from "@/infra/auth/auth.module.js";
import { ReadNotificationUseCase } from "@/domain/notification/application/use-case/read-notification.js";
import { ReadNotificationController } from "@/infra/http/controllers/read-notification.controller.js";

@Module({
    imports: [
        DatabaseModule, 
        AuthModule,
    ],
    controllers: [
        ReadNotificationController,
    ],
    providers: [
        ReadNotificationUseCase,
    ],
    exports: [
        ReadNotificationUseCase,
    ],
})
export class NotificationModule {}