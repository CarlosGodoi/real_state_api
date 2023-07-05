import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error'
import { makeDeleteImmobileUseCase } from '@/use-cases/factories/make-delete-imovel-use-case'

import { FastifyReply, FastifyRequest } from 'fastify'

export async function deleteImmobile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  try {
    const deleteImmobileUseCase = makeDeleteImmobileUseCase()

    const { id } = request.params as { id: string }
    // console.log('id request:', id)

    await deleteImmobileUseCase.execute(id)
  } catch (error) {
    if (error instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: error.message })
    }
    throw error
  }

  return reply.status(200).send()
}
