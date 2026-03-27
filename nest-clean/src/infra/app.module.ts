import { AuthModule } from "@/infra/auth/auth.module.js";
import { envSchema } from "@/infra/env/env.js";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "./http/http.module.js";
import { EnvModule } from "./env/env.module.js";

@Module({
    imports: [
        ConfigModule.forRoot({
            validate: (env) => envSchema.parse(env),
            isGlobal: true,
        }),
        AuthModule,
        HttpModule,
        EnvModule,
    ],
})
export class AppModule { }