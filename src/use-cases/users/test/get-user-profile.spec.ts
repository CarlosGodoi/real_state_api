import { it, describe, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from '../get-user-profile'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository) // sut => system under test
  })
  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: 'COMPRADOR',
      senha: await hash('123456', 6),
      telefone: '51 9999-99999',
    })

    console.log(createdUser)

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.nome).toEqual('John Doe')
    expect(user.email).toEqual('johndoe@mail.com')
  })

  it('should be able to get user profile with wrong id', async () => {
    expect(() =>
      sut.execute({
        userId: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
