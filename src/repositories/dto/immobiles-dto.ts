import { StatusImovel, TipoContrato } from '@prisma/client'
interface IEndereco {
  rua: string
  bairro: string
  cidade: string
  numero: number
  cep: string
}
export interface ICreateImovelDTO {
  id?: string
  tipoContrato: TipoContrato
  quantiadeQuartos: number
  area: number
  preco: number
  endereco: IEndereco
  status?: StatusImovel
  corretorId?: string
  images?: string[]
}
export interface IUpdateImovelDTO {
  id: string
  tipoContrato?: TipoContrato
  quantiadeQuartos?: number
  preco?: number
  status?: StatusImovel
  corretorId?: string
}

export interface IUploadImovelDTO {
  images: { path: string }[]
  id: string
}
