import { PrismaImmobilesRepository } from "@/repositories/prisma/prisma-immobiles-repository";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { GetImmobileByIdUseCase } from "../Immobiles/getImmobileById";

export function makeGetImmobileByIdUseCase() {
  const getImmobileByIdRepository = new PrismaImmobilesRepository();
  const usersRepository = new PrismaUsersRepository();
  const getImmobileByIdUseCase = new GetImmobileByIdUseCase(
    getImmobileByIdRepository,
    usersRepository
  );

  return getImmobileByIdUseCase;
}
