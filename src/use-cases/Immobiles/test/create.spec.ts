import { ImmobileRepository } from '@/repositories/immobiles-repository'
import { CreateImmobileUseCase } from '../create'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryImmobilesRepository } from '@/repositories/in-memory/in-memory-immobiles-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { RegisterUseCase } from '@/use-cases/users/register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

let immobilesRepository: ImmobileRepository
let sut: CreateImmobileUseCase

let usersRepository: UsersRepository
let userUseCase: RegisterUseCase

describe('Create Immobile Use Case', () => {
  beforeEach(() => {
    immobilesRepository = new InMemoryImmobilesRepository()
    sut = new CreateImmobileUseCase(immobilesRepository)
    usersRepository = new InMemoryUsersRepository()
    userUseCase = new RegisterUseCase(usersRepository)
  })

  it('should be able to create immobile', async () => {
    const imovel = await sut.execute({
      businessName: 'Teste',
      area: 200,
      status: 'NEGOCIACAO',
      quantidadeQuartos: 3,
      quantidadeBanheiros: 3,
      endereco: {
        rua: 'rua teste',
        bairro: 'teste',
        cidade: 'teste-1',
        numero: 123,
        cep: '93533500',
      },
      preco: 200,
      tipoContrato: 'VENDA',
      tipoImovel: 'CASA',
      description: 'Teste',
      corretorId: 'corretor-1',
    })

    expect(imovel.id).toEqual(expect.any(String))
  })

  it('it should not be possible to create a property with a different broker profile', async () => {
    const role = 'COMPRADOR'
    const { user } = await userUseCase.execute({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: role,
      senha: '123456',
      telefone: '51 9999-99999',
    })

    expect(user.perfil).toBe(role)
    const corretorId = 'corretor-1'
    try {
      await sut.execute({
        businessName: 'Teste',
        area: 200,
        status: 'NEGOCIACAO',
        quantidadeQuartos: 3,
        quantidadeBanheiros: 3,
        endereco: {
          rua: 'rua teste',
          bairro: 'teste',
          cidade: 'teste-1',
          numero: 123,
          cep: '93533500',
        },
        preco: 200,
        tipoContrato: 'VENDA',
        tipoImovel: 'CASA',
        description: 'Teste',
        corretorId,
      })
      throw new InvalidCredentialsError()
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCredentialsError)
    }
  })
})
