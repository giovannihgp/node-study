import { PrismaService } from "@/infra/database/prisma/prisma.service.js";

export async function clearDatabase(prisma: PrismaService) {
    await prisma.answer.deleteMany()
    await prisma.question.deleteMany()
    await prisma.user.deleteMany()
}