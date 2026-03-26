import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository.js";
import { Injectable } from "@nestjs/common";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment.js";

@Injectable()
export class PrismaQuestionAttachmentsRepository implements QuestionAttachmentsRepository
{
    findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
        throw new Error('Method not implemented.')
    }

    deleteManyByQuestionId(questionId: string): Promise<void> {
        throw new Error('Method not implemented.')
    }
}