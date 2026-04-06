import { BadRequestException, Body, Controller, ForbiddenException, HttpCode, NotFoundException, Param, Put } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user.decorator.js";
import type { UserPayload } from "@/infra/auth/jwt.strategy.js";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";
import { z } from "zod";
import { EditQuestionUseCase } from "@/domain/forum/application/use-cases/edit-question.js";
import { ResourceNotFoundError } from "@/core/errors/errors/resource-not-found-error.js";
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error.js";

const editQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema)

type EditQuestionBodySchema = z.infer<typeof editQuestionBodySchema>

@Controller('/questions')
export class EditQuestionController {
    constructor(private editQuestion: EditQuestionUseCase) {}

    @Put(':id')
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditQuestionBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string,
    ) {
        const { title, content } = body
        const userId = user.sub

        const result = await this.editQuestion.execute({
            title,
            content,
            authorId: userId,
            attachmentsIds: [],
            questionId,
        })

        if(result.isLeft()) {
            const error = result.value

            if (error instanceof ResourceNotFoundError) {
                throw new NotFoundException()
            }

            if (error instanceof NotAllowedError) {
                throw new ForbiddenException()
            }

            throw new BadRequestException()
        }
    }
}