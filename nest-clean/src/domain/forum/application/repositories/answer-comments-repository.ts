import type { PaginationParams } from "@/core/repositories/pagination-params.js";
import { AnswerComment } from "../../enterprise/entities/answer-comment.js";

export abstract class AnswerCommentsRepository {
    abstract findById(id: string): Promise<AnswerComment | null>
    abstract findManyByAnswerId(answerId: string, params: PaginationParams,): Promise<AnswerComment[]>
    abstract create(answersComment: AnswerComment): Promise<void>
    abstract delete(answersComment: AnswerComment): Promise<void>
}