import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { AuthModule } from "@/infra/auth/auth.module.js";
import { UploadAttachmentController } from "@/infra/http/controllers/upload-attachment.controller.js";
import { UploadAndCreateAttachmentUseCase } from "@/domain/forum/application/use-cases/upload-and-create-attachment.js";
import { UPLOADER } from "@/infra/cryptography/cryptography.token.js";
import { LocalUploader } from "@/infra/storage/local-uploader.js";

@Module({
    imports: [
        DatabaseModule,
        AuthModule,
    ],
    controllers: [
        UploadAttachmentController,
    ],
    providers: [
        UploadAndCreateAttachmentUseCase,
        {
            provide: UPLOADER,
            useClass: LocalUploader,
        },
    ],
})
export class AttachmentModule {}