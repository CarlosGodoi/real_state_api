import { StatusImovel, TipoContrato, TipoImovel } from "@prisma/client";
interface IEndereco {
  rua: string;
  bairro: string;
  cidade: string;
  numero: number;
  cep: string;
}
export interface ICreateImovelDTO {
  id?: string;
  businessName?: string | null
  tipoContrato: TipoContrato;
  quantidadeQuartos: number;
  quantidadeBanheiros: number;
  area: number;
  preco: number;
  description?: string | null
  endereco: IEndereco;
  status?: StatusImovel;
  tipoImovel: TipoImovel;
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
