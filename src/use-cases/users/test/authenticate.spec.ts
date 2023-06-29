import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from '../authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository) // sut => system under test
  })
  it('should be able to authenticate', async () => {
    await usersRepository.create({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: 'COMPRADOR',
      senha: await hash('123456', 6),
      telefone: '51 9999-99999',
    })

    const { user } = await sut.execute({
      email: 'johndoe@mail.com',
      senha: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() =>
      sut.execute({
        email: 'johndoe@mail.com',
        senha: '123456',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: 'COMPRADOR',
      senha: await hash('123456', 6),
      telefone: '51 9999-99999',
    })

    await expect(() =>
      sut.execute({
        email: 'johndoe@mail.com',
        senha: '123123',
      }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
