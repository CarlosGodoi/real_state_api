import { ICreateImovelDTO } from "@/repositories/dto/immobiles-dto";
import { ImmobileRepository } from "@/repositories/immobiles-repository";
import { Imovel } from "@prisma/client";
import path from "path";

export class CreateImmobileUseCase {
  constructor(private imovelRepository: ImmobileRepository) { }

  async execute({
    status,
    businessName,
    area,
    endereco,
    preco,
    quantidadeQuartos,
    quantidadeBanheiros,
    description,
    tipoContrato,
    tipoImovel,
    corretorId,
    images,
  }: ICreateImovelDTO): Promise<Imovel> {
    if (images && images.length > 0) {
      const newImages = images.map((img) => {
        return path.dirname(img);
      });
      images = newImages;
    }

    const imovel = await this.imovelRepository.create({
      status,
      businessName,
      area,
      endereco,
      preco,
      quantidadeQuartos,
      quantidadeBanheiros,
      description,
      tipoContrato,
      tipoImovel,
      corretorId,
    });

    console.log('imovel =>', imovel);


    return imovel;
  }
}
