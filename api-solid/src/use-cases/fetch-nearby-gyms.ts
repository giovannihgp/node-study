import type { GymsRepository } from "@/repositories/gyms-repository.js";
import { type Gym } from "@prisma/client";

interface FetchNearbyGymsUseCaseRequest {
    userLaitude: number
    userLongitude: number
}

interface FetchNearbyGymsUseCaseResponse {
    gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
    constructor(private gymsRepository: GymsRepository) {}

    async execute({
        userLaitude,
        userLongitude,
    }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
        const gyms = await this.gymsRepository.findManyNearby({
            latitude: userLaitude,
            longitude: userLongitude,
        })

        return {
            gyms,
        }
    }
}