import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module.js";
import { RedisCacheRepository } from "./redis/redis-cache-repository.js";
import { RedisService } from "./redis/redis.service.js";
import { CACHE_REPOSITORY } from "../database/prisma/repositories/repositories.tokens.js";

@Module({
    imports: [
        EnvModule,
    ],
    providers: [
        RedisService,
        {
            provide: CACHE_REPOSITORY,
            useClass: RedisCacheRepository,
        },
    ],
    exports: [
        CACHE_REPOSITORY,
    ],
})
export class CacheModule {}