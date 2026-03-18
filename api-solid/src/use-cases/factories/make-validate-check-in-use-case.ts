import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository.js"
import { ValidationCheckInUseCase } from "../validate-check-in.js"

export function makeValidateCheckInUseCase() {
    const checkInsRepository = new PrismaCheckInsRepository()
    const useCase = new ValidationCheckInUseCase(checkInsRepository)

    return useCase
}