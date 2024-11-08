import { IPagination } from "@/@types/pagination";
import { prisma } from "@/lib/prisma";
import { ImmobileRepository } from "../immobiles-repository";
import {
  ICreateImovelDTO,
  IUpdateImovelDTO,
  IUploadImovelDTO,
} from "../dto/immobiles-dto";
import { Imovel, Prisma, TipoContrato, StatusImovel, TipoImovel } from "@prisma/client";
import { env } from "@/env";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";

const Pagination = (skip: number, take: number) => {
  const calcSkip = (skip - 1) * take;

  const pagination = {
    skip: calcSkip < 0 ? 0 : calcSkip,
    take: Number(take),
  };
  return pagination;
};

export interface IImoveisParamsGetAll extends IPagination {
  search?: string;
  precoMin?: number;
  precoMax?: number;
  tipoContrato?: string;
  tipoImovel?: string;
  status?: string;
  cidade?: string;
  bairro?: string;
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
                return { path: img };
              })
              : [],
          },
        },
        businessName: data.businessName,
        preco: data.preco,
        quantidadeQuartos: data.quantidadeQuartos,
        quantidadeBanheiros: data.quantidadeBanheiros,
        status: "PENDENTE",
        tipoContrato: data.tipoContrato,
        tipoImovel: data.tipoImovel,
        description: data.description,
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
    });

    return imovel;
  }

  async getAll({ skip, take, search, ...filter }: IImoveisParamsGetAll) {
    let pagination: IPagination = {};

    let where: Prisma.ImovelWhereInput = {};
    if (skip && take) pagination = Pagination(skip, take);

    if (filter) {
      if (filter.precoMax && filter.precoMin) {
        where = {
          ...where,
          preco: {
            lte: +filter.precoMax,
            gte: +filter.precoMin,
          },
        };
      } else if (filter.precoMax) {
        where = {
          ...where,
          preco: {
            lte: +filter.precoMax,
          },
        };
      } else if (filter.precoMin) {
        where = {
          ...where,
          preco: {
            gte: +filter.precoMin,
          },
        };
      }

      if (filter.tipoContrato) {
        const parseTipoContratoInArray = filter.tipoContrato.split(
          ","
        ) as TipoContrato[];
        where = {
          ...where,
          tipoContrato: {
            in: parseTipoContratoInArray,
          },
        };
      }

      if (filter.tipoImovel) {
        const parseTipoImovelInArray = filter.tipoImovel.split(
          ","
        ) as TipoImovel[];
        where = {
          ...where,
          tipoImovel: {
            in: parseTipoImovelInArray,
          },
        };
      }

      if (filter.status) {
        const parseStatusInArray = filter.status.split(",") as StatusImovel[];
        where = {
          ...where,
          status: {
            in: parseStatusInArray,
          },
        };
      }

      if (filter.cidade) {
        where = {
          ...where,
          endereco: {
            cidade: filter.cidade,
          },
        };
      }
      if (filter.bairro) {
        where = {
          ...where,
          endereco: {
            bairro: filter.bairro,
          },
        };
      }
    }

    if (search) {
      where = {
        ...where,
        OR: [
          {
            endereco: {
              cidade: {
                startsWith: search,
                mode: "insensitive",
              },
            },
          },
          {
            endereco: {
              bairro: {
                startsWith: search,
                mode: "insensitive",
              },
            },
          },
        ],
      };
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
        ImageImovel: true,
      },
      orderBy: {
        tipoContrato: "asc",
      },
      ...pagination,
    });
    const total = await prisma.imovel.count({ where });

    const totalPage = take ? Math.ceil(total / take) : total;

    imovel.forEach((elem) => {
      elem.ImageImovel.forEach((fr) => {
        fr.path = `${env.APP_HOST}/${fr.path}`;
      });
    });

    const result: {
      imoveis: Imovel[];
      total: number;
      totalPage?: number;
    } = {
      imoveis: imovel,
      total,
    };

    if (pagination.take) result.totalPage = totalPage;

    return result;
  }

  async findById(id: string) {
    const imovel = await prisma.imovel.findUnique({
      where: {
        id,
      },
      include: {
        ImageImovel: true,
        endereco: true,
      },
    });
    return imovel;
  }

  async update(data: IUpdateImovelDTO) {
    const imovel = await prisma.imovel.update({
      where: {
        id: data.id ? data.id : "",
      },
      data: {
        tipoContrato: data.tipoContrato,
        preco: data.preco,
        status: data.status,
      },
    });
    return imovel;
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
              return { path };
            }),
          },
        },
      },
    });
    return imovel;
  }

  async delete(id: string) {
    const imovel = await prisma.imovel.findUnique({
      where: {
        id,
      },
      include: {
        ImageImovel: true,
      },
    });

    if (!imovel) {
      throw new ResourceNotFoundError();
    }

    const imageIds = imovel.ImageImovel.map((image) => image.id);
    await prisma.imageImovel.deleteMany({
      where: {
        id: {
          in: imageIds,
        },
      },
    });

    await prisma.imovel.delete({
      where: {
        id,
      },
    });
  }
}
