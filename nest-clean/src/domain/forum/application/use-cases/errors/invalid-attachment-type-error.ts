import { UseCaseError } from "@/core/errors/use-case-error.js";

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
    constructor(type: string) {
        super(`File type "${type}" is not valid.`)
    }
}