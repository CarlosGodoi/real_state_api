import { ICreateImovelDTO } from '@/repositories/dto/immobiles-dto'
import { makeCreateImmobilelUseCase } from '@/use-cases/factories/make-create-immobile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function createImmobile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log(request.body);

  const createImovelBodySchema = z.object({
    tipoContrato: z.enum(['VENDA', 'ALUGUEL']),
    quantidadeQuartos: z.number(),
    quantidadeBanheiros: z.number(),
    area: z.number(),
    preco: z.number(),
    status: z.enum(['NEGOCIACAO', 'VENDIDO', 'ALUGADO', 'PENDENTE']),
    tipoImovel: z.enum(['CASA', 'APARTAMENTO']),
    endereco: z.object({
      rua: z.string().trim().min(1, { message: 'Rua é obrigatório.' }),
      bairro: z.string().trim().min(1, { message: 'Rua é obrigatório.' }),
      cidade: z.string().trim().min(1, { message: 'Rua é obrigatório.' }),
      numero: z.number(),
      cep: z.string(),
    }),
    images: z.array(z.string()).nullable(),
  })
  const body: ICreateImovelDTO = request.body as ICreateImovelDTO
  body.corretorId = request.user.sub

  const { area, endereco, preco, quantidadeQuartos, quantidadeBanheiros, status, tipoContrato, tipoImovel, } =
    createImovelBodySchema.parse(request.body)

  try {
    const createImovelUseCase = makeCreateImmobilelUseCase()

    await createImovelUseCase.execute({
      corretorId: body.corretorId,
      quantidadeQuartos,
      quantidadeBanheiros,
      area,
      preco,
      tipoContrato,
      tipoImovel,
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
