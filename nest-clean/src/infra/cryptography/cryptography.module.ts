import { Module } from "@nestjs/common";
import { JwtEncrypter } from "./jwt-encrypter.js";
import { BcryptHasher } from "./bcrypt-hasher.js";
import { ENCRYPTER, HASH_COMPARER, HASH_GENERATOR } from "./cryptography.token.js";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule,
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