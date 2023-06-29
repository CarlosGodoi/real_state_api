import { PrismaImmobilesRepository } from '@/repositories/prisma/prisma-immobiles-repository'
import { CreateImmobileUseCase } from '../Immobiles/create'

export function makeCreateImmobilelUseCase() {
  const immobileRepository = new PrismaImmobilesRepository()
  const immobileUseCase = new CreateImmobileUseCase(immobileRepository)

  return immobileUseCase
}
