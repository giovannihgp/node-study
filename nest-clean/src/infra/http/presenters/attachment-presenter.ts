import { Attachment } from "@/domain/forum/enterprise/entities/attachment.js";

export class AttachmentPresenter {
    static toHTTP(attachment: Attachment) {
        return {
            id: attachment.id.toString(),
            title: attachment.title,
            url: attachment.url,
        }
    }
}