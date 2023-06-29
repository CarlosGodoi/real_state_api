import crypto from 'node:crypto'
import multer from 'fastify-multer'
import { FastifyRequest } from 'fastify'

export function safeRandomUUID() {
  return crypto.randomUUID().replaceAll('-', '')
}

export const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, 'public/images/immobiles')
  },
  filename: function (request: FastifyRequest, file, cb) {
    const id = request.params as { id: string }
    const newNameFile = `${id}-${safeRandomUUID()}`
    const extensionFile = file.originalname.split('.')[1]
    cb(null, `${newNameFile}.${extensionFile}`)
  },
})
