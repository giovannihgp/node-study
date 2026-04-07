import { InMemoryStudentsRepository } from "@test/repositories/in-memory-students-repository.js";
import { FakeHasher } from "@test/cryptography/fake-hasher.js";
import { FakeEncrypter } from "@test/cryptography/fake-encrypter.js";
import { AuthenticateStudentUseCase } from "./authenticate-student.js";
import { makeStudent } from "@test/factories/make-student.js";

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Register Student', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        fakeHasher = new FakeHasher()
        encrypter = new FakeEncrypter()

        sut = new AuthenticateStudentUseCase(
            inMemoryStudentsRepository, 
            fakeHasher, 
            encrypter,
        )
    })

    it('should be able to authenticate a student', async () => {
        const student = makeStudent({
            email: 'maria@gazin.com.br',
            password: await fakeHasher.hash('123456'),
        })

        inMemoryStudentsRepository.items.push(student)

        const result = await sut.execute({
            email: 'maria@gazin.com.br',
            password: '123456',
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            accessToken: expect.any(String),
        })
    })
})