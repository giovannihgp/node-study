import { Entify } from "@/core/entities/entity.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";

export interface CommentProps {
    authorId: UniqueEntityID
    content: string
    createdAt: Date
    updated?: Date
}

export abstract class Comment<
    Props extends CommentProps,
> extends Entify<Props> {
    get authorId() {
        return this.props.authorId
    }

    get content() {
        return this.props.content
    }

    get createdAt() {
        return this.props.createdAt
    }

    get updated() {
        return this.props.updated
    }

    private touch() {
        this.props.updated = new Date()
    }

    set content(content: string) {
        this.props.content = content
        this.touch()
    }


}