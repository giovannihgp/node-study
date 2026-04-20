import { Question as PrismaQuestion, User as PrismaUser, Attachment as PrismaAttachment } from "@prisma/client";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-detail.js";
import { Slug } from "@/domain/forum/enterprise/entities/value-objects/slug.js";
import { PrismaAttachmentMapper } from "./prisma-attachment-mapper.js";

type PrismaQuestionDetails = PrismaQuestion & {
    author: PrismaUser
    attachments: PrismaAttachment[]
}

export class PrismaQuestionDetailsMapper {
    static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
        return QuestionDetails.create({
            questionId: new UniqueEntityID(raw.id),
            authorId: new UniqueEntityID(raw.author.id),
            author: raw.author.name,
            title: raw.title,
            slug: Slug.create(raw.slug),
            attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
            bestAnswerId: raw.bestAnswerId
              ? new UniqueEntityID(raw.bestAnswerId)
              : null,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        })
    }
}