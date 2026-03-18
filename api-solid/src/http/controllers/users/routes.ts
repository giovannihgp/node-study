import type { FastifyInstance } from "fastify";
import { authenticate } from "./authenticate.js";
import { register } from "./register.js";
import { profile } from "./profile.js";
import { refresh } from "./refresh.js";
import { verifyJwt } from "../../middlewares/verify-jwt.js";

export async function usersRoutes(app: FastifyInstance) {
    app.post('/users', register)
    app.post('/sessions', authenticate)

    app.patch('/token/refresh', refresh)

    app.get('/me', { onRequest: [verifyJwt] }, profile)
}