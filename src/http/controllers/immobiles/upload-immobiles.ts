import { makeUploadImmobilelUseCase } from '@/use-cases/factories/make-upload-immobile-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import fs from 'fs'

import { pipeline } from 'stream/promises'

export async function uploadImmobile(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { id } = request.params as { id: string }
  const parts = request.files()
  const images = []

  for await (const part of parts) {
    const fileName = `${id}-${Date.now()}-${part.filename}`
    await pipeline(
      part.file,
      fs.createWriteStream(`public/images/immobiles/${fileName}`),
    )
    images.push({ path: `public/images/immobiles/${fileName}` })
  }

  const uploadUseCase = makeUploadImmobilelUseCase()

  await uploadUseCase.execute({
    id,
    images,
  })
  return reply.status(200).send()
}
