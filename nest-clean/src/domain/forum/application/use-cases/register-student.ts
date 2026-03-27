import { left, right, Either } from "@/core/either.js";
import { Injectable, Inject } from "@nestjs/common";
import { Student } from "../../enterprise/entities/student.js";
import { StudentsRepository } from "../repositories/students-repository.js";
import { HashGenerator } from "../cryptography/hash-generator.js";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error.js";
import { STUDENTS_REPOSITORY } from "@/infra/database/prisma/repositories/repositories.tokens.js";
import { HASH_GENERATOR } from "@/infra/cryptography/cryptography.token.js";

interface RegisterStudentUseCaseRequest {
    name: string
    email: string
    password: string
}

type RegisterStudentUseCaseResponse = Either<StudentAlreadyExistsError, { student: Student }>

@Injectable()
export class RegisterStudentUseCase {
    constructor(
        @Inject(STUDENTS_REPOSITORY)
        private studentsRepository: StudentsRepository,
        @Inject(HASH_GENERATOR)
        private hashGenerator: HashGenerator,
    ) {}

    async execute({
        name,
        email,
        password,
    }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
        const studentWithSameEmail = await this.studentsRepository.findByEmail(email)

        if (studentWithSameEmail) {
            return left(new StudentAlreadyExistsError(email))
        }

        const hashedPassword = await this.hashGenerator.hash(password)

        const student = Student.create({
            name,
            email,
            password: hashedPassword,
        })

        await this.studentsRepository.create(student)

        return right({
            student,
        })
    }
}