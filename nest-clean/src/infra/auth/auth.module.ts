import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { PrismaModule } from "@/infra/database/prisma.module.js";
import { AuthenticateController } from "@/infra/http/controllers/authenticate.controller.js";
import { JwkStrategy } from "./jwt.strategy.js";
import { StudentModule } from "@/module/student.module.js";
import { CryptographyModule } from "../cryptography/cryptography.module.js";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard.js";
import { EnvService } from "../env/env.service.js";
import { EnvModule } from "../env/env.module.js";

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        StudentModule,
        CryptographyModule,
        JwtModule.registerAsync({
            imports: [EnvModule],
            inject: [EnvService],
            global: true,
            useFactory(env: EnvService) {
                const privateKey = env.get('JWT_PRIVATE_KEY')
                const publicKey = env.get('JWT_PUBLIC_KEY')

                return {
                    signOptions: { algorithm: 'RS256' },
                    privateKey: Buffer.from(privateKey, 'base64').toString('utf-8'),
                    publicKey: Buffer.from(publicKey, 'base64').toString('utf-8'),
                }
            },
        }),
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