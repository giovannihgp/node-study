import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { Env } from "@/infra/env/env.js";
import { PrismaModule } from "@/infra/database/prisma.module.js";
import { AuthenticateController } from "@/infra/http/controllers/authenticate.controller.js";
import { JwkStrategy } from "./jwt.strategy.js";

@Module({
    imports: [
        PrismaModule,
        PassportModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory(config: ConfigService<Env, true>) {
                const privateKey = config.get('JWT_PRIVATE_KEY', { infer: true })
                const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

                return {
                    signOptions: { algorithm: 'RS256' },
                    privateKey: Buffer.from(privateKey, 'base64').toString('utf-8'),
                    publicKey: Buffer.from(publicKey, 'base64').toString('utf-8'),
                }
            },
        }),
    ],
    controllers: [AuthenticateController],
    providers: [JwkStrategy],
})
export class AuthModule { }