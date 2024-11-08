import { ICreateImovelDTO } from '@/repositories/dto/immobiles-dto'
import { makeCreateImmobilelUseCase } from '@/use-cases/factories/make-create-immobile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z, ZodError } from 'zod'

export async function createImmobile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  console.log(request.body);

  const createImovelBodySchema = z.object({
    businessName: z.string(),
    tipoContrato: z.enum(['VENDA', 'ALUGUEL']),
    quantidadeQuartos: z.number(),
    quantidadeBanheiros: z.number(),
    area: z.number(),
    preco: z.number(),
    status: z.enum(['NEGOCIACAO', 'VENDIDO', 'ALUGADO', 'PENDENTE']),
    tipoImovel: z.enum(['CASA', 'APARTAMENTO']),
    description: z.string(),
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

  const { businessName, area, endereco, preco, quantidadeQuartos, quantidadeBanheiros, status, tipoContrato, tipoImovel, description } =
    createImovelBodySchema.parse(request.body)

  try {
    const createImovelUseCase = makeCreateImmobilelUseCase()

    const novoImovel = await createImovelUseCase.execute({
      corretorId: body.corretorId,
      businessName,
      quantidadeQuartos,
      quantidadeBanheiros,
      area,
      preco,
      tipoContrato,
      tipoImovel,
      description,
      status,
      endereco: {
        rua: endereco.rua,
        bairro: endereco.bairro,
        cidade: endereco.cidade,
        numero: endereco.numero,
        cep: endereco.cep,
      },
    })

    return reply.status(201).send({ novoImovel })
  } catch (error) {
    if (error instanceof ZodError) {
      console.log("Erros de validação:", error.errors);
      return reply.status(400).send({ message: "Erro de validação", errors: error.errors });
    } else if (error instanceof Error) {
      console.error("Erro ao criar imóvel:", error);
      return reply.status(409).send({ message: error.message });
    } else {
      console.error("Erro desconhecido ao criar imóvel:", error);
      return reply.status(500).send({ message: "Erro interno do servidor" });
    }
  }
}
