import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";
import { DomainEvents } from "@/core/events/domain-events.js";
import { PaginationParams } from "@/core/repositories/pagination-params.js";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository.js";
import { Question } from "@/domain/forum/enterprise/entities/question.js";
import { InMemoryStudentsRepository } from "./in-memory-students-repository.js";
import { InMemoryAttachmentsRepository } from "./in-memory-attachments-repository.js";
import { InMemoryQuestionAttachmentsRepository } from "./in-memory-question-attachments-repository.js";
import { QuestionDetails } from "@/domain/forum/enterprise/entities/value-objects/question-detail.js";

export class InMemoryQuestionsRepository implements QuestionsRepository {
    public items: Question[] = []

    constructor(
        private questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
        private attachmentsRepository: InMemoryAttachmentsRepository,
        private studentsRepository: InMemoryStudentsRepository,
    ) {}

    async findById(id: string) {
        const question = this.items.find((item) => 
          item.id.equals(new UniqueEntityID(id)))

        if (!question) {
            return null
        }

        return question
    }

    async findBySlug(slug: string) {
        const question = this.items.find((item) => item.slug.value === slug)

        if (!question) {
            return null
        }

        return question
    }

    async findDetailsBySlug(slug: string) {
        const question = this.items.find((item) => item.slug.value === slug)

        if (!question) {
            return null
        }

        const author = this.studentsRepository.items.find((student) => {
            return student.id.equals(question.authorId)
        })

        if (!author) {
            throw new Error(
                `Author with ID "${question.authorId.toString()}" does not exist.`
            )
        }

        const questionAttachments = this.questionAttachmentsRepository.items.filter(
            (questionAttachment) => {
                return questionAttachment.questionId.equals(question.id)
            },
        )

        const attachments = questionAttachments.map((questionAttachment) => {
            const attachment = this.attachmentsRepository.items.find(
                (attachment) => {
                    return attachment.id.equals(questionAttachment.attachmentId)
                }
            )

            if (!attachment) {
                throw new Error(
                    `Attachment with ID "${questionAttachment.attachmentId.toString()}" does not exist.`,
                )
            }

            return attachment
        })

        return QuestionDetails.create({
            questionId: question.id,
            authorId: question.authorId,
            author: author.name,
            title: question.title,
            slug: question.slug,
            content: question.content,
            bestAnswerId: question.bestAnswerId,
            attachments,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        })
    }

    async findManyRecent({ page }: PaginationParams) {
        const question = this.items
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
          .slice((page - 1) * 20, page * 20)

        return question
    }

    async create(question: Question) {
        this.items.push(question)

        await this.questionAttachmentsRepository.createMany(
            question.attachments.getItems(),
        )

        DomainEvents.dispatchEventsForAggregate(question.id)
    }

    async save(question: Question) {
        const itemIndex = this.items.findIndex((item) => item.id === question.id)

        this.items[itemIndex] = question

        await this.questionAttachmentsRepository.createMany(
            question.attachments.getNewItems(),
        )

        await this.questionAttachmentsRepository.deleteMany(
            question.attachments.getRemovedItems(),
        )

        DomainEvents.dispatchEventsForAggregate(question.id)
    }

    async delete(question: Question) {
        const itemIndex = this.items.findIndex((item) => item.id === question.id)

        this.items.splice(itemIndex, 1)

        this.questionAttachmentsRepository.deleteManyByQuestionId(
            question.id.toString(),
        )
    }
}