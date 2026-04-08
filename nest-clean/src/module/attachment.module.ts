import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { AuthModule } from "@/infra/auth/auth.module.js";
import { UploadAttachmentController } from "@/infra/http/controllers/upload-attachment.controller.js";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
    ],
    controllers: [
        UploadAttachmentController,
    ],
})
export class AttachmentModule {}