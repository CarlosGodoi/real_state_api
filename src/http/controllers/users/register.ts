import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeRegisterUseCase } from "@/use-cases/factories/make-register-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    nome: z.string().trim().min(1, { message: "Nome é obrigatório" }),
    email: z.string().email(),
    senha: z.string().min(6),
    perfil: z.enum(["ADMIN", "CORRETOR", "COMPRADOR"]),
    telefone: z.string(),
  });

  const { nome, email, telefone, senha, perfil } = registerBodySchema.parse(
    request.body
  );

  try {
    const registerUseCase = makeRegisterUseCase();

    await registerUseCase.execute({
      nome,
      email,
      perfil,
      telefone,
      senha,
    });
  } catch (error) {
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: error.message });
    } else {
      if (error instanceof InvalidCredentialsError) {
        return reply.status(401).send({ message: error.message });
      }
    }
    throw error;
  }

  return reply.status(201).send();
}
