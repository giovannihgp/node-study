import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import { AnswerComment } from "../../enterprise/entities/answer-comment.js";

export interface AnswerCommentsRepository {
    findById(id: string): Promise<AnswerComment | null>
    findManyByAnswerId(answerId: string, params: PaginationParams,): Promise<AnswerComment[]>
    create(answersComment: AnswerComment): Promise<void>
    delete(answersComment: AnswerComment): Promise<void>
}