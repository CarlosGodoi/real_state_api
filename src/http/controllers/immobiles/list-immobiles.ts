import { IImoveisParamsGetAll } from '@/repositories/prisma/prisma-immobiles-repository'
import { makeListImmobilesUseCase } from '@/use-cases/factories/make-list-immobiles-use-case'

import { FastifyReply, FastifyRequest } from 'fastify'

export async function listImmobiles(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const {
    skip,
    take,
    bairro,
    cidade,
    precoMax,
    precoMin,
    status,
    tipoContrato,
    search,
  } = request.query as IImoveisParamsGetAll

  const listImmobilesUseCase = makeListImmobilesUseCase()
  const imoveis = await listImmobilesUseCase.execute({
    skip: skip ? +skip : 1,
    take: take ? +take : 10,
    bairro,
    cidade,
    precoMax,
    precoMin,
    status,
    tipoContrato,
    search,
  })

  reply.status(200).send(imoveis)
}
