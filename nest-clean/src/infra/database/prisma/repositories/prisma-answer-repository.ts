import { PaginationParams } from "@/core/repositories/pagination-params.js";
import { AnswersRepository } from "@/domain/forum/application/repositories/answer-repository.js";
import { Answer } from "@/domain/forum/enterprise/entities/answer.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaAnswerRepository implements AnswersRepository
{
    findById(id: string): Promise<Answer | null> {
        throw new Error('Method not implemented.')
    }

    findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
        throw new Error('Method not implemented.')
    }

    create(answer: Answer): Promise<void> {
        throw new Error('Method not implemented.')
    }

    save(answer: Answer): Promise<void> {
        throw new Error('Method not implemented.')
    }

    delete(answer: Answer): Promise<void> {
        throw new Error('Method not implemented.')
    }
}