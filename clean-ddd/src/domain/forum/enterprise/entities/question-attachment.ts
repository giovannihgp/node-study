import { Entify } from "@/core/entities/entity.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";

export interface QuestionAttachmentProps {
    questionId: UniqueEntityID
    attachmentId: UniqueEntityID
}

export class QuestionAttachment extends Entify<QuestionAttachmentProps> {
    get questionId() {
        return this.props.questionId
    }

    get attachmentId() {
        return this.props.attachmentId
    }

    static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
        const questionAttachment = new QuestionAttachment(props, id)

        return questionAttachment
    }
}