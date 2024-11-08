import { ImmobileRepository } from '@/repositories/immobiles-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryImmobilesRepository } from '@/repositories/in-memory/in-memory-immobiles-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { RegisterUseCase } from '@/use-cases/users/register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { DeleteImmobileUseCase } from '../delete'
import { CreateImmobileUseCase } from '../create'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

let immobilesRepository: ImmobileRepository
let sut: CreateImmobileUseCase

let deleteUseCase: DeleteImmobileUseCase

let usersRepository: UsersRepository
let userUseCase: RegisterUseCase

describe('Delete Immobile Use Case', () => {
  beforeEach(() => {
    immobilesRepository = new InMemoryImmobilesRepository()
    sut = new CreateImmobileUseCase(immobilesRepository)

    usersRepository = new InMemoryUsersRepository()
    userUseCase = new RegisterUseCase(usersRepository)

    deleteUseCase = new DeleteImmobileUseCase(immobilesRepository)
  })

  it('should be able to delete immobile', async () => {
    const role = 'CORRETOR'
    const { user } = await userUseCase.execute({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: role,
      senha: '123456',
      telefone: '51 9999-99999',
    })

    const immobileId = 'imovel-01'
    const corretorId = 'corretor-1'

    const immobile = await sut.execute({
      id: immobileId,
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

    expect(user.perfil).toEqual('CORRETOR')
    expect(immobile.id).toBe(immobileId)

    expect(() => deleteUseCase.execute(immobileId))
  })

  it('should not be able to delete immobile with same role buyer', async () => {
    const { user } = await userUseCase.execute({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: 'CORRETOR',
      senha: '123456',
      telefone: '51 9999-99999',
    })

    const immobileId = 'imovel-01'
    const corretorId = user.id

    await sut.execute({
      id: immobileId,
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

    try {
      await deleteUseCase.execute(immobileId)
      throw new InvalidCredentialsError()
    } catch (error) {
      expect(error).toBeInstanceOf(InvalidCredentialsError)
    }
  })
})
