import { PrismaImmobilesRepository } from '@/repositories/prisma/prisma-immobiles-repository'
import { DeleteImmobileUseCase } from '../Immobiles/delete'

export function makeDeleteImmobileUseCase() {
  const deleteImmobileRepository = new PrismaImmobilesRepository()
  const deleteImmobileUseCase = new DeleteImmobileUseCase(
    deleteImmobileRepository,
  )

  return deleteImmobileUseCase
}
