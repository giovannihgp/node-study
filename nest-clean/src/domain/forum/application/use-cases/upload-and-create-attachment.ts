import { Either, left, right } from "@/core/either.js";
import { Injectable, Inject } from "@nestjs/common";
import { InvalidAttachmentTypeError } from "./errors/invalid-attachment-type-error.js";
import { Attachment } from "../../enterprise/entities/attachment.js";
import { AttachmentsRepository } from "../repositories/attachments-repository.js";
import { Uploader } from "../storage/uploader.js";
import { ATTACHMENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";
import { UPLOADER } from "@/infra/cryptography/cryptography.token.js";

interface UploadAndCreateAttachmentRequest {
    fileName: string
    fileType: string
    body: Buffer
}

type UploadAndCreateAttachmentResponse = Either<
    InvalidAttachmentTypeError,
    { attachment: Attachment }
>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
    constructor(
        @Inject(ATTACHMENTS_REPOSITORY)
        private attachmentsRepository: AttachmentsRepository,
        @Inject(UPLOADER)
        private uploader: Uploader,
    ) {}

    async execute({
        fileName,
        fileType,
        body,
    } : UploadAndCreateAttachmentRequest): Promise<UploadAndCreateAttachmentResponse> {
        if (!/^(image\/(jpeg|png))$|^application\/pdf$/.test(fileType)) {
            return left(new InvalidAttachmentTypeError(fileType))
        }

        const { url } = await this.uploader.upload({ fileName, fileType, body })

        const attachment = Attachment.create({
            title: fileName,
            url,
        })

        await this.attachmentsRepository.create(attachment)

        return right({
            attachment,
        })
    }
}