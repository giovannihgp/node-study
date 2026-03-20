import { Module } from "@nestjs/common";
import { CreateQuestionController } from "@/controllers/create-question.controller";
import { PrismaModule } from "@/database/prisma.module";
import { AuthModule } from "@/auth/auth.module";

@Module({
    imports: [
        PrismaModule,
        AuthModule,
    ],
    controllers: [
        CreateQuestionController,
    ],
})
export class QuestionsModule {}