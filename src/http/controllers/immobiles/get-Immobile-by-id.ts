import { makeGetImmobileByIdUseCase } from "@/use-cases/factories/make-get-immobile-by-id-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export async function getImmobileById(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const getImmobileByIdUseCase = makeGetImmobileByIdUseCase();
    const { id } = request.params as { id: string };

    const imovel = await getImmobileByIdUseCase.execute(id);

    return reply.status(200).send(imovel);
  } catch (error) {
    if (error) {
      return reply.status(409).send({ message: error });
    }
    throw error;
  }
}
