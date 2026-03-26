import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository.js";
import { Injectable } from "@nestjs/common";
import { PaginationParams } from "@/core/repositories/pagination-params.js";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment.js";

@Injectable()
export class PrismaAnswerCommentsRepository implements AnswerCommentsRepository
{
    findById(id: string): Promise<AnswerComment | null> {
        throw new Error('Method not implemented.')
    }

    findManyByAnswerId(answerId: string, params: PaginationParams): Promise<AnswerComment[]> {
        throw new Error('Method not implemented.')
    }

    create(answersComment: AnswerComment): Promise<void> {
        throw new Error('Method not implemented.')
    }

    delete(answersComment: AnswerComment): Promise<void> {
        throw new Error('Method not implemented.')
    }
}