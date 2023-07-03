import { ImmobileRepository } from '@/repositories/immobiles-repository'
import { IImoveisParamsGetAll } from '@/repositories/prisma/prisma-immobiles-repository'
import { Imovel } from '@prisma/client'

export class ListImmobilesUseCase {
  constructor(private imovelRepository: ImmobileRepository) {}

  async execute(
    pagination: IImoveisParamsGetAll,
  ): Promise<{ total: number; imoveis: Imovel[] }> {
    const imoveis = await this.imovelRepository.getAll(pagination)

    return imoveis
  }
}
