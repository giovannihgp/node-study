import type { CheckInsRepository } from "@/repositories/check-ins-repository.js";

interface GetUserMettricsUseCaseRequest {
    userId: string
}

interface GetUserMettricsUseCaseResponse {
    checkInsCount: number
}

export class GetUserMetricsUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({
        userId,
    }: GetUserMettricsUseCaseRequest): Promise<GetUserMettricsUseCaseResponse> {
        const checkInsCount = await this.checkInsRepository.countByUserId(userId)

        return {
            checkInsCount,
        }
    }
}