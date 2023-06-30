import { ICreateImovelDTO } from '@/repositories/dto/immobiles-dto'
import { ImmobileRepository } from '@/repositories/immobiles-repository'
import { Imovel } from '@prisma/client'
import path from 'path'

export class CreateImmobileUseCase {
  constructor(private imovelRepository: ImmobileRepository) {}

  async execute({
    status,
    area,
    endereco,
    preco,
    quantidadeQuartos,
    tipoContrato,
    corretorId,
    images,
  }: ICreateImovelDTO): Promise<Imovel> {
    if (images && images.length > 0) {
      const newImages = images.map((img) => {
        return path.dirname(img)
      })
      images = newImages
    }

    const imovel = await this.imovelRepository.create({
      status,
      area,
      endereco,
      preco,
      quantidadeQuartos,
      tipoContrato,
      corretorId,
    })

    return imovel
  }
}
