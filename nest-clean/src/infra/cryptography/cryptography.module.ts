import { Module } from "@nestjs/common";
import { JwtEncrypter } from "./jwt-encrypter.js";
import { BcryptHasher } from "./bcrypt-hasher.js";
import { ENCRYPTER, HASH_COMPARER, HASH_GENERATOR } from "./cryptography.token.js";
import { JwtModule } from "@nestjs/jwt";
import { EnvModule } from "../env/env.module.js";
import { EnvService } from "../env/env.service.js";

@Module({
    imports: [
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
    providers: [
        { 
            provide: ENCRYPTER, 
            useClass: JwtEncrypter,
        },
        { 
            provide: HASH_COMPARER, 
            useClass: BcryptHasher,
        },
        { 
            provide: HASH_GENERATOR, 
            useClass: BcryptHasher,
        },
    ],
    exports: [ENCRYPTER, HASH_COMPARER, HASH_GENERATOR],
})
export class CryptographyModule {}