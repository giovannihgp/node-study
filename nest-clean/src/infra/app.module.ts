import { AuthModule } from "@/infra/auth/auth.module.js";
import { envSchema } from "@/infra/env/env.js";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HttpModule } from "./http/http.module.js";

@Module({
    imports: [
        ConfigModule.forRoot({
            validate: (env) => envSchema.parse(env),
            isGlobal: true,
        }),
        AuthModule,
        HttpModule,
    ],
})
export class AppModule { }