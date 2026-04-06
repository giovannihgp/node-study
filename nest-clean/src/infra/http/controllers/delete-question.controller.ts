import { BadRequestException, Controller, HttpCode, Param, Delete } from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user.decorator.js";
import type { UserPayload } from "@/infra/auth/jwt.strategy.js";
import { DeleteQuestionUseCase } from "@/domain/forum/application/use-cases/delete-question.js";

@Controller('/questions')
export class DeleteQuestionController {
    constructor(private deleteQuestion: DeleteQuestionUseCase) {}

    @Delete(':id')
    @HttpCode(204)
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionId: string,
    ) {
        const userId = user.sub

        const result = await this.deleteQuestion.execute({
            questionId,
            authorId: userId,
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }
    }
}