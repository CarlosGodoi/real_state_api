import { ImmobileRepository } from '@/repositories/immobiles-repository'
import { CreateImmobileUseCase } from '../create'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryImmobilesRepository } from '@/repositories/in-memory/in-memory-immobiles-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { RegisterUseCase } from '@/use-cases/users/register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UpdateImmobileUseCase } from '../update'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

let immobilesRepository: ImmobileRepository
let sut: CreateImmobileUseCase

let updateUseCase: UpdateImmobileUseCase

let usersRepository: UsersRepository
let userUseCase: RegisterUseCase

describe('Update Immobile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    userUseCase = new RegisterUseCase(usersRepository)

    immobilesRepository = new InMemoryImmobilesRepository()
    sut = new CreateImmobileUseCase(immobilesRepository)

    updateUseCase = new UpdateImmobileUseCase(
      immobilesRepository,
      usersRepository,
    )
  })

  it('should be able to update immobile', async () => {
    const role = 'CORRETOR'
    const corr = await userUseCase.execute({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: role,
      senha: '123456',
      telefone: '51 9999-99999',
    })
    const corretorId = corr.user.id

    const immobileId = 'imovel-01'
    await sut.execute({
      id: immobileId,
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
      corretorId,
    })

    const updateImmobile = await updateUseCase.execute({
      id: immobileId,
      corretorId,
      preco: 500,
      quantidadeQuartos: 5,
      status: 'VENDIDO',
      tipoContrato: 'VENDA',
    })

    expect(updateImmobile).toBeDefined()
  })

  it('it should not be possible to update the datas of a immobile', async () => {
    const role = 'COMPRADOR'
    await userUseCase.execute({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: role,
      senha: '123456',
      telefone: '51 9999-99999',
    })

    try {
      await sut.execute({
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
        corretorId: 'non-exists',
      })
      throw new InvalidCredentialsError()
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCredentialsError)
    }
  })
})
