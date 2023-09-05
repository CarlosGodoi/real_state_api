import { IPagination } from "@/@types/pagination";
import { Imovel } from "@prisma/client";
import {
  ICreateImovelDTO,
  IUpdateImovelDTO,
  IUploadImovelDTO,
} from "./dto/immobiles-dto";

export interface ImmobileRepository {
  create(data: ICreateImovelDTO): Promise<Imovel>;
  getAll(
    data: IPagination
  ): Promise<{ total: number; imoveis: Imovel[]; totalPage?: number }>;
  getImmobileById(id: string): Promise<Imovel | null>;
  findById(id: string): Promise<Imovel | null>;
  update(data: IUpdateImovelDTO): Promise<Imovel>;
  upload(path: IUploadImovelDTO): Promise<Imovel> | null;
  delete(id: string): Promise<void>;
}
