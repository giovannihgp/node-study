import { AuthenticateStudentUseCase } from "@/domain/forum/application/use-cases/authenticate-student.js";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student.js";
import { CryptographyModule } from "@/infra/cryptography/cryptography.module.js";
import { DatabaseModule } from "@/infra/database/database.module.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [
        DatabaseModule,
        CryptographyModule,
    ],
    providers: [
        RegisterStudentUseCase,
        AuthenticateStudentUseCase,
    ],
    exports: [
        RegisterStudentUseCase,
        AuthenticateStudentUseCase,
    ],
})
export class StudentModule {}