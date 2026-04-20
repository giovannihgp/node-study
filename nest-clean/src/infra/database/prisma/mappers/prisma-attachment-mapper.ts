import { Prisma, Attachment as PrismaAttachment } from "@prisma/client";
import { Attachment } from "@/domain/forum/enterprise/entities/attachment.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";

export class PrismaAttachmentMapper {
    static toDomain(raw: PrismaAttachment): Attachment {
        return Attachment.create(
            {
                title: raw.title,
                url: raw.url,
            },
            new UniqueEntityID(raw.id),
        )
    }
    
    static toPrisma(
        attachment: Attachment,
    ): Prisma.AttachmentUncheckedCreateInput {
        return {
            id: attachment.id.toString(),
            title: attachment.title,
            url: attachment.url,
        }
    }
}