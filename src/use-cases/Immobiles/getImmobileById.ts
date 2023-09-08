import { ImmobileRepository } from "@/repositories/immobiles-repository";

import { Imovel } from "@prisma/client";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";

export class GetImmobileByIdUseCase {
  constructor(private imovelRepository: ImmobileRepository) {}

  async execute(id: string): Promise<Imovel | null> {
    const imovel = await this.imovelRepository.findById(id);

    if (!imovel) {
      throw new ResourceNotFoundError();
    }

    return imovel;
  }
}
