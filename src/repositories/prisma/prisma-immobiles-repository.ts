import { IPagination } from '@/@types/pagination'
import { prisma } from '@/lib/prisma'
import { ImmobileRepository } from '../immobiles-repository'
import {
  ICreateImovelDTO,
  IUpdateImovelDTO,
  IUploadImovelDTO,
} from '../dto/immobiles-dto'
import { Imovel, Prisma, StatusImovel, TipoContrato } from '@prisma/client'

const Pagination = (skip: number, take: number) => {
  const calcSkip = (skip - 1) * take

  const pagination = {
    skip: calcSkip < 0 ? 0 : calcSkip,
    take: Number(take),
  }
  return pagination
}

export interface IImoveisParamsGetAll extends IPagination {
  search?: string
  filter?: {
    preco?: number
    tipoContrato?: TipoContrato[]
    status?: StatusImovel[]
    cidade?: string
    bairro?: string
  }
}
export class PrismaImmobilesRepository implements ImmobileRepository {
  async create(data: ICreateImovelDTO) {
    const imovel = await prisma.imovel.create({
      data: {
        area: data.area,
        ImovelUsuario: {
          create: {
            usuario: {
              connect: {
                id: data.corretorId,
              },
            },
          },
        },
        ImageImovel: {
          createMany: {
            data: data.images
              ? data.images.map((img) => {
                  return { path: img }
                })
              : [],
          },
        },
        preco: data.preco,
        quantiadeQuartos: data.quantiadeQuartos,
        status: 'PENDENTE',
        tipoContrato: data.tipoContrato,
        endereco: {
          create: {
            bairro: data.endereco.bairro,
            cep: data.endereco.cep,
            cidade: data.endereco.cidade,
            numero: data.endereco.numero,
            rua: data.endereco.rua,
          },
        },
      },
    })

    return imovel
  }

  async update(data: IUpdateImovelDTO) {
    const imovel = await prisma.imovel.update({
      where: {
        id: data.id ? data.id : '',
      },
      data: {
        tipoContrato: data.tipoContrato,
        preco: data.preco,
        status: data.status,
      },
    })
    return imovel
  }

  async getAll({ skip, take, filter }: IImoveisParamsGetAll) {
    let pagination: IPagination = {}

    let where: Prisma.ImovelWhereInput = {}
    if (skip && take) pagination = Pagination(skip, take)

    if (filter) {
      if (filter.preco) {
        where = {
          ...where,
          preco: {
            gte: filter.preco,
          },
        }
      }

      if (filter.tipoContrato) {
        where = {
          ...where,
          tipoContrato: {
            in: filter.tipoContrato,
          },
        }
      }

      if (filter.status) {
        where = {
          ...where,
          status: {
            in: filter.status,
          },
        }
      }

      if (filter.cidade) {
        where = {
          ...where,
          endereco: {
            cidade: filter.cidade,
          },
        }
      }
      if (filter.bairro) {
        where = {
          ...where,
          endereco: {
            bairro: filter.bairro,
          },
        }
      }
    }

    const imovel = await prisma.imovel.findMany({
      where,
      include: {
        endereco: {
          select: {
            bairro: true,
            cidade: true,
            cep: true,
            rua: true,
            numero: true,
          },
        },
      },
      orderBy: {
        tipoContrato: 'asc',
      },
      ...pagination,
    })
    const total = await prisma.imovel.count({ where })

    const totalPage = take ? Math.ceil(total / take) : total

    const result: {
      imoveis: Imovel[]
      total: number
      totalPage?: number
    } = {
      imoveis: imovel,
      total,
    }

    if (pagination.take) result.totalPage = totalPage

    return result
  }

  async findById(id: string) {
    const imovel = await prisma.imovel.findUnique({
      where: {
        id,
      },
      include: {
        ImageImovel: true,
      },
    })
    return imovel
  }

  async upload({ id, images }: IUploadImovelDTO) {
    const imovel = await prisma.imovel.update({
      where: {
        id,
      },
      data: {
        ImageImovel: {
          createMany: {
            data: images.map(({ path }) => {
              return { path }
            }),
          },
        },
      },
    })
    return imovel
  }

  async delete(id: string) {
    await prisma.imovel.delete({
      where: {
        id,
      },
    })
  }
}
