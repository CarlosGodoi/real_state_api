import { PrismaImmobilesRepository } from '@/repositories/prisma/prisma-immobiles-repository'
import { UploadImmobileUseCase } from '../Immobiles/upload-image'

export function makeUploadImmobilelUseCase() {
  const uploadImmobileRepository = new PrismaImmobilesRepository()
  const uploadImmobileUseCase = new UploadImmobileUseCase(
    uploadImmobileRepository,
  )

  return uploadImmobileUseCase
}
