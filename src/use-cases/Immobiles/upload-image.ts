import { IUploadImovelDTO } from '@/repositories/dto/immobiles-dto'
import { ImmobileRepository } from '@/repositories/immobiles-repository'
import { Imovel } from '@prisma/client'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'

export class UploadImmobileUseCase {
  constructor(private imovelRepository: ImmobileRepository) {}

  async execute({ id, images }: IUploadImovelDTO): Promise<Imovel> {
    const imovel = await this.imovelRepository.findById(id)

    if (!imovel) {
      throw new ResourceNotFoundError()
    }

    await this.imovelRepository.upload({
      id,
      images,
    })

    return imovel
  }
}
