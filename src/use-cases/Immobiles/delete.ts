import { ImmobileRepository } from '@/repositories/immobiles-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

export class DeleteImmobileUseCase {
  constructor(
    private imovelRepository: ImmobileRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(id: string): Promise<void> {
    console.log(id)

    const imovelExists = await this.imovelRepository.findById(id)
    console.log(imovelExists)

    if (!imovelExists) {
      throw new ResourceNotFoundError()
    }

    const isAuthenticated = await this.usersRepository.findById(id)

    if (
      isAuthenticated?.perfil !== 'CORRETOR' &&
      isAuthenticated?.perfil !== 'ADMIN'
    ) {
      throw new InvalidCredentialsError()
    }

    await this.imovelRepository.delete(id)
  }
}
