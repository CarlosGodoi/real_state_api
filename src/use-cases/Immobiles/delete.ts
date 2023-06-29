import { ImmobileRepository } from '@/repositories/immobiles-repository'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class DeleteImmobileUseCase {
  constructor(private imovelRepository: ImmobileRepository) {}

  async execute(id: string): Promise<void> {
    const imovelExists = await this.imovelRepository.findById(id)

    if (!imovelExists) {
      throw new ResourceNotFoundError()
    }
    await this.imovelRepository.delete(id)
  }
}
