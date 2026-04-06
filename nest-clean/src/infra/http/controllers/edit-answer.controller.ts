import { BadRequestException, Controller, Body, Param, Put, HttpCode } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user.decorator.js";
import type { UserPayload } from "@/infra/auth/jwt.strategy.js";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe.js";
import { z } from "zod";
import { EditAnswerUseCase } from "@/domain/forum/application/use-cases/edit-answer.js";

const editAnswerBodySchema = z.object({
    content: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema)

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>

@Controller('/answers')
export class EditAnswerController {
    constructor(private editAnswer: EditAnswerUseCase) {}

    @Put(':id')
    @HttpCode(204)
    async handle(
        @Body(bodyValidationPipe) body: EditAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string,
    ) {
        const { content } = body
        const userId = user.sub

        const result = await this.editAnswer.execute({
            content,
            answerId,
            authorId: userId,
            attachmentsIds: [],
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }
    }
}