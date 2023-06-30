import { ICreateImovelDTO } from '@/repositories/dto/immobiles-dto'
import { makeCreateImmobilelUseCase } from '@/use-cases/factories/make-create-immobile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createImmobile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createImovelBodySchema = z.object({
    tipoContrato: z.enum(['VENDA', 'ALUGUEL']),
    quantidadeQuartos: z.number(),
    area: z.number(),
    preco: z.number(),
    status: z.enum(['NEGOCIACAO', 'VENDIDO', 'ALUGADO', 'PENDENTE']),
    endereco: z.object({
      rua: z.string().trim().min(1, { message: 'Rua é obrigatório.' }),
      bairro: z.string().trim().min(1, { message: 'Rua é obrigatório.' }),
      cidade: z.string().trim().min(1, { message: 'Rua é obrigatório.' }),
      numero: z.number(),
      cep: z.string(),
    }),
  })
  const body: ICreateImovelDTO = request.body as ICreateImovelDTO
  body.corretorId = request.user.sub

  const { area, endereco, preco, quantidadeQuartos, status, tipoContrato } =
    createImovelBodySchema.parse(request.body)

  try {
    const createImovelUseCase = makeCreateImmobilelUseCase()

    await createImovelUseCase.execute({
      corretorId: body.corretorId,
      quantidadeQuartos,
      area,
      preco,
      tipoContrato,
      status,
      endereco: {
        rua: endereco.rua,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        numero: endereco.numero,
        cep: endereco.cep,
      },
    })
  } catch (error) {
    if (error) {
      return reply.status(409).send({ message: error })
    }
    throw error
  }

  return reply.status(201).send()
}
