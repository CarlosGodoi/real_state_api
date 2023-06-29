import { it, describe, expect, beforeEach } from 'vitest'
import { RegisterUseCase } from '../register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })
  it('should be able to register', async () => {
    const { user } = await sut.execute({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: 'COMPRADOR',
      senha: '123456',
      telefone: '51 9999-99999',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: 'COMPRADOR',
      senha: '123456',
      telefone: '51 9999-99999',
    })

    const isPasswordCorrectlyHashed = await compare('123456', user.senha)

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const email = 'johndoe@mail.com'

    await sut.execute({
      nome: 'John Doe',
      email,
      perfil: 'COMPRADOR',
      senha: '123456',
      telefone: '51 9999-99999',
    })

    await expect(() =>
      sut.execute({
        nome: 'John Doe',
        email,
        perfil: 'COMPRADOR',
        senha: '123456',
        telefone: '51 9999-99999',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
