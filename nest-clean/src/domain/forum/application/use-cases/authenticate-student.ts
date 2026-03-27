import { left, right, Either } from "@/core/either.js";
import { Injectable, Inject } from "@nestjs/common";
import { StudentsRepository } from "../repositories/students-repository.js";
import { HashComparer } from "../cryptography/hash-comparer.js";
import { Encrypter } from "../cryptography/encrypter.js";
import { WrongCredentialsError } from "./errors/wrong-credentials-error.js";
import { STUDENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";
import { HASH_COMPARER, ENCRYPTER } from "@/infra/cryptography/cryptography.token.js";

interface AuthenticateStudentUseCaseRequest {
    email: string
    password: string
}

type AuthenticateStudentUseCaseResponse = Either<WrongCredentialsError, { accessToken: string }>

@Injectable()
export class AuthenticateStudentUseCase {
    constructor(
        @Inject(STUDENTS_REPOSITORY)
        private studentsRepository: StudentsRepository,
        @Inject(HASH_COMPARER)
        private hashComparer: HashComparer,
        @Inject(ENCRYPTER)
        private encrypter: Encrypter,
    ) {}

    async execute({
        email,
        password,
    }: AuthenticateStudentUseCaseRequest): Promise<AuthenticateStudentUseCaseResponse> {
        const student = await this.studentsRepository.findByEmail(email)

        if (!student) {
            return left(new WrongCredentialsError())
        }

        const isPasswordValid = await this.hashComparer.compare(
            password,
            student.password,
        )

        if (!isPasswordValid) {
            return left(new WrongCredentialsError())
        }

        const accessToken = await this.encrypter.encrypt({
            sub: student.id.toString(),
        })

        return right({
            accessToken,
        })
    }
}