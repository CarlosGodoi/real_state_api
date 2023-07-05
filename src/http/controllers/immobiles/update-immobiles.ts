import { makeUpdateImmobilelUseCase } from '@/use-cases/factories/make-upadate-immobile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function upadateImmobile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const updateImovelBodySchema = z.object({
    tipoContrato: z.enum(['VENDA', 'ALUGUEL']),
    preco: z.number(),
    status: z.enum(['NEGOCIACAO', 'VENDIDO', 'ALUGADO', 'PENDENTE']),
  })

  const corretorId = request.user.sub

  const { preco, status, tipoContrato } = updateImovelBodySchema.parse(
    request.body,
  )

  try {
    const updateImovelUseCase = makeUpdateImmobilelUseCase()
    const { id } = request.params as { id: string }

    await updateImovelUseCase.execute({
      id,
      corretorId,
      preco,
      tipoContrato,
      status,
    })
  } catch (error) {
    if (error) {
      return reply.status(409).send({ message: error })
    }
    throw error
  }

  return reply.status(200).send()
}
