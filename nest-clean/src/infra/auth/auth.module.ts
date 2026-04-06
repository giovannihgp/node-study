import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "@/infra/database/prisma.module.js";
import { AuthenticateController } from "@/infra/http/controllers/authenticate.controller.js";
import { JwkStrategy } from "./jwt.strategy.js";
import { StudentModule } from "@/module/student.module.js";
import { CryptographyModule } from "../cryptography/cryptography.module.js";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import { EnvService } from "../env/env.service.js";

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        StudentModule,
        CryptographyModule,
    ],
    controllers: [
        AuthenticateController,
    ],
    providers: [
        JwkStrategy,
        EnvService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard,
        },
    ],
})
export class AuthModule { }