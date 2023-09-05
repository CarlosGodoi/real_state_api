import { StatusImovel, TipoContrato } from "@prisma/client";
interface IEndereco {
  rua: string;
  bairro: string;
  cidade: string;
  numero: number;
  cep: string;
}
export interface ICreateImovelDTO {
  id?: string;
  tipoContrato: TipoContrato;
  quantidadeQuartos: number;
  area: number;
  preco: number;
  endereco: IEndereco;
  status?: StatusImovel;
  corretorId?: string;
  images?: string[] | null;
}
export interface IUpdateImovelDTO {
  id: string;
  tipoContrato?: TipoContrato;
  quantidadeQuartos?: number;
  preco?: number;
  status?: StatusImovel;
  corretorId?: string;
}

export interface IUploadImovelDTO {
  images: { path: string }[];
  id: string;
}
