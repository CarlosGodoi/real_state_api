import { PrismaImmobilesRepository } from '@/repositories/prisma/prisma-immobiles-repository'
import { UpdateImmobileUseCase } from '../Immobiles/update'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository'

export function makeUpdateImmobilelUseCase() {
  const upadateImmobileRepository = new PrismaImmobilesRepository()
  const usersRepository = new PrismaUsersRepository()
  const updateImmobileUseCase = new UpdateImmobileUseCase(
    upadateImmobileRepository,
    usersRepository,
  )

  return updateImmobileUseCase
}
