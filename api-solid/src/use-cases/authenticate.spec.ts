import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository.js";
import { AuthenticateUseCase } from "./authenticate.js";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error.js";
import { hash } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(usersRepository)
    })

    it('should be able to authenticate', async () => {
        await usersRepository.create({
            name: 'João Victor',
            email: 'joaovictor@gazin.com',
            password_hash: await hash('123456', 6),
        })

        const { user } = await sut.execute({
            email: 'joaovictor@gazin.com',
            password: '123456',
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it('should not be able to authenticate with wrong email', async () => {
        await expect(() =>
            sut.execute({
                email: 'joaovictor@gazin.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it('should not be able to authenticate with wrong email', async () => {
        await usersRepository.create({
            name: 'João Victor',
            email: 'joaovictor@gazin.com',
            password_hash: await hash('123456', 6),
        })

        await expect(() =>
            sut.execute({
                email: 'joaovictor@gazin.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})