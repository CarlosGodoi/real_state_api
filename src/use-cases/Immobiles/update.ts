import { IUpdateImovelDTO } from "@/repositories/dto/immobiles-dto";
import { ImmobileRepository } from "@/repositories/immobiles-repository";

import { Imovel } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { UsersRepository } from "@/repositories/users-repository";

export class UpdateImmobileUseCase {
  constructor(
    private imovelRepository: ImmobileRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    id,
    status,
    preco,
    tipoContrato,
    corretorId,
  }: IUpdateImovelDTO): Promise<Imovel> {
    const corretorExists = await this.usersRepository.findById(
      corretorId || ""
    );

    if (!corretorExists) {
      throw new ResourceNotFoundError();
    }

    const imovel = await this.imovelRepository.findById(id);

    if (!imovel) {
      throw new ResourceNotFoundError();
    }
    // const teste = status || imovel.status;

    await this.imovelRepository.update({
      id,
      corretorId,
      status: status || imovel.status,
      preco: preco || imovel.preco,
      tipoContrato: tipoContrato || imovel.tipoContrato,
    });

    return imovel;
  }
}
