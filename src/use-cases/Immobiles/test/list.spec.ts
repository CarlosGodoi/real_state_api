import { ImmobileRepository } from '@/repositories/immobiles-repository'
import { CreateImmobileUseCase } from '../create'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryImmobilesRepository } from '@/repositories/in-memory/in-memory-immobiles-repository'
import { UsersRepository } from '@/repositories/users-repository'
import { RegisterUseCase } from '@/use-cases/users/register'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ListImmobilesUseCase } from '../list'
// import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'

let immobilesRepository: ImmobileRepository
let sut: CreateImmobileUseCase

let listUseCase: ListImmobilesUseCase

let usersRepository: UsersRepository
let userUseCase: RegisterUseCase

describe('List Immobile Use Case', () => {
  beforeEach(() => {
    immobilesRepository = new InMemoryImmobilesRepository()
    sut = new CreateImmobileUseCase(immobilesRepository)

    listUseCase = new ListImmobilesUseCase(immobilesRepository)

    usersRepository = new InMemoryUsersRepository()
    userUseCase = new RegisterUseCase(usersRepository)
  })

  it('should be able to list immobile', async () => {
    const role = 'COMPRADOR'
    const { user } = await userUseCase.execute({
      nome: 'John Doe',
      email: 'johndoe@mail.com',
      perfil: role,
      senha: '123456',
      telefone: '51 9999-99999',
    })
    expect(user.perfil).toBe(role)

    await sut.execute({
      id: 'imovel-01',
      area: 200,
      status: 'NEGOCIACAO',
      quantidadeQuartos: 3,
      endereco: {
        rua: 'rua teste',
        bairro: 'teste',
        cidade: 'teste-1',
        numero: 123,
        cep: '93533500',
      },
      preco: 200000,
      tipoContrato: 'VENDA',
      corretorId: 'corretor-2',
    })

    await sut.execute({
      id: 'imovel-02',
      area: 500,
      status: 'PENDENTE',
      quantidadeQuartos: 3,
      endereco: {
        rua: 'Rua nova',
        bairro: 'Bairro teste',
        cidade: 'Testando',
        numero: 943,
        cep: '95535500',
      },
      preco: 300000,
      tipoContrato: 'ALUGUEL',
      corretorId: 'corretor-1',
    })

    const immobiles = await listUseCase.execute({
      filter: {
        tipoContrato: ['VENDA'],
        bairro: 'teste',
        cidade: 'teste-1',
        preco: 200000,
      },
      search: 'teste',
      skip: 1,
      take: 1,
    })

    expect(immobiles.total).toBe(2)
    expect(immobiles.imoveis).toHaveLength(1)
    expect(immobiles.imoveis[0]).toMatchObject({ tipoContrato: 'VENDA' })

    expect(immobiles.imoveis[0]).toHaveProperty('tipoContrato', 'VENDA')
  })
})
