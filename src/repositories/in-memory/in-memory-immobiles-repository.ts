import { IPagination } from '@/@types/pagination'
import { Imovel, StatusImovel } from '@prisma/client'
import {
  ICreateImovelDTO,
  IUpdateImovelDTO,
  IUploadImovelDTO,
} from '../dto/immobiles-dto'
import { ImmobileRepository } from '../immobiles-repository'

interface ExtendedImovel extends Imovel {
  corretorId: string
  images: { path: string }[]
}

export class InMemoryImmobilesRepository implements ImmobileRepository {
  public items: Imovel[] = []

  async create(data: ICreateImovelDTO) {
    const imovel = {
      id: data.id || 'imovel-01',
      tipoContrato: data.tipoContrato,
      tipoImovel: data.tipoImovel,
      quantidadeQuartos: data.quantidadeQuartos,
      quantidadeBanheiros: data.quantidadeBanheiros,
      area: data.area,
      preco: data.preco,
      endereco: data.endereco,
      status: data.status || StatusImovel.ALUGADO,
      corretorId: data.corretorId || 'corretor-1',
      images: data.images || undefined,
      createdAt: new Date(),
    }

    this.items.push(imovel)

    return imovel
  }

  async update(data: IUpdateImovelDTO): Promise<ExtendedImovel> {
    const existingIndex = this.items.findIndex((item) => item.id === data.id)

    if (existingIndex === -1) {
      throw new Error(`Imovel with ID ${data.id} not found.`)
    }

    const existingImovel = this.items[existingIndex]
    const updatedImovel: ExtendedImovel = {
      ...existingImovel,
      corretorId: data.corretorId || existingImovel.id,
      status: data.status || existingImovel.status,
      preco: data.preco || existingImovel.preco,
      tipoContrato: data.tipoContrato || existingImovel.tipoContrato,
      images: [],
    }

    this.items[existingIndex] = updatedImovel

    return updatedImovel
  }

  async getAll(data: IPagination) {
    const take = data.take || 10

    const skip = data.skip || 0
    const startIndex = (take - 1) * skip
    const endIndex = take * skip

    const total = this.items.length

    const totalPage = Math.ceil(total / skip)

    const imoveis = this.items.slice(startIndex, endIndex)

    return { total, imoveis, totalPage }
  }

  async findById(id: string) {
    const imovel = this.items.find((item) => item.id === id)

    if (!id) {
      return null
    }

    return imovel || null
  }

  async upload(path: IUploadImovelDTO) {
    const immobileExists = this.items.findIndex((item) => item.id === path.id)

    if (immobileExists === -1) {
      throw new Error(`Imovel with ID ${path.id} not found.`)
    }

    const immobile = this.items[immobileExists]
    const updatedImmobile: ExtendedImovel = {
      ...immobile,

      images: path.images,
      corretorId: '',
    }

    this.items[immobileExists] = updatedImmobile

    return updatedImmobile
  }

  async delete(id: string) {
    this.items.findIndex((item) => item.id === id)
  }
}
