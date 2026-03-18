import type { CheckInsRepository } from "@/repositories/check-ins-repository.js";
import { LateCheckInValidationError } from "./errors/late-check-in-validation-error.js";
import { ResourceNotFoundError } from "./errors/resource-not-found-error.js";
import { type CheckIn } from "@prisma/client";
import dayjs from "dayjs";

interface ValidationCheckInUseCaseRequest {
    checkInId: string
}

interface ValidationCheckInUseCaseResponse {
    checkIn: CheckIn
}

export class ValidationCheckInUseCase {
    constructor(private checkInsRepository: CheckInsRepository) {}

    async execute({
        checkInId,
    }: ValidationCheckInUseCaseRequest): Promise<ValidationCheckInUseCaseResponse> {
        const checkIn = await this.checkInsRepository.findById(checkInId)

        if (!checkIn) {
            throw new ResourceNotFoundError()
        }

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(
            checkIn.created_at,
            'minutes',
        )

        if (distanceInMinutesFromCheckInCreation > 20) {
            throw new LateCheckInValidationError()
        }

        checkIn.validated_at = new Date()

        await this.checkInsRepository.save(checkIn)

        return {
            checkIn,
        }
    }
}