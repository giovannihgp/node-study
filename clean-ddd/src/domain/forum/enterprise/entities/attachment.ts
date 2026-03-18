import { Entify } from "@/core/entities/entity.js";
import { UniqueEntityID } from "@/core/entities/unique-entity-id.js";

interface AttachmentProps {
    title: string
    link: string
}

export class Attachment extends Entify<AttachmentProps> {
    get title() {
        return this.props.title
    }

    get link() {
        return this.props.link
    }

    static create(props: AttachmentProps, id?: UniqueEntityID) {
        const attachment = new Attachment(props, id)

        return attachment
    }
}