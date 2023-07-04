import { PrismaImmobilesRepository } from '@/repositories/prisma/prisma-immobiles-repository'
import { ListImmobilesUseCase } from '../Immobiles/list'

export function makeListImmobilesUseCase() {
  const listImmobilesRepository = new PrismaImmobilesRepository()
  const listImmobilesUseCase = new ListImmobilesUseCase(listImmobilesRepository)

  return listImmobilesUseCase
}
