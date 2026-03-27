import { Body, Controller, HttpCode, Post, UsePipes, BadRequestException, ConflictException } from "@nestjs/common";
import { z } from "zod";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe.js";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student.js";
import { StudentAlreadyExistsError } from "@/domain/forum/application/use-cases/errors/student-already-exists-error.js";
import { Public } from "@/infra/auth/public.js";

const createAccontBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
})

type CreateAccontBodySchema = z.infer<typeof createAccontBodySchema>

@Controller('/accounts')
@Public()
export class CreateAccountController {
    constructor(private registerStudent: RegisterStudentUseCase) { }

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccontBodySchema))
    async handle(@Body() body: CreateAccontBodySchema) {
        const { name, email, password } = body

        const result = await this.registerStudent.execute({
            name,
            email,
            password,
        })

        if (result.isLeft()) {
            const error = result.value

            switch (error.constructor) {
                case StudentAlreadyExistsError:
                    throw new ConflictException(error.message)
                default:
                    throw new BadRequestException(error.message)
            }
        }
    }
}