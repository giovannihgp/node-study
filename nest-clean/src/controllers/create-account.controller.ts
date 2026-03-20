import { Body, ConflictException, Controller, HttpCode, Post, UsePipes } from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { hash } from "bcryptjs";
import { z } from "zod";
import { ZodValidationPipe } from "@/pipes/zod-validation-pipe";

const createAccontBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
})

type CreateAccontBodySchema = z.infer<typeof createAccontBodySchema>

@Controller('/accounts')
export class CreateAccountController {
    constructor(private prisma: PrismaService) {}

    @Post()
    @HttpCode(201)
    @UsePipes(new ZodValidationPipe(createAccontBodySchema))
    async handle(@Body() body: CreateAccontBodySchema) {
        const { name, email, password } = body

        const userWithSameEmail = await this.prisma.user.findUnique({
            where: {
                email,
            },
        })

        if (userWithSameEmail) {
            throw new ConflictException('User with same e-mail address already exists.',)
        }

        const hashedPassword = await hash(password, 8)

        await this.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        })
    }
}