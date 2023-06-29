import { PrismaImmobilesRepository } from '@/repositories/prisma/prisma-immobiles-repository'
import { ListImovelUseCase } from '../Immobiles/list'

export function makeListImmobilesUseCase() {
  const listImmobilesRepository = new PrismaImmobilesRepository()
  const listImmobilesUseCase = new ListImovelUseCase(listImmobilesRepository)

  return listImmobilesUseCase
}
