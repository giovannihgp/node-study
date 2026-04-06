import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function clearDatabase() {
    try {
        await prisma.attachment.deleteMany()
        await prisma.comment.deleteMany()
        await prisma.answer.deleteMany()
        await prisma.question.deleteMany()
        await prisma.user.deleteMany()

        console.log('Banco limpo com sucesso')
    } catch (err) {
        console.log('Erro ao limpar banco:', err)
    } finally {
        await prisma.$disconnect()
    }
}

clearDatabase()