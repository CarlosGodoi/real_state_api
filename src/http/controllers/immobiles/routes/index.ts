import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { createImmobile } from '../create-immobiles'
import { deleteImmobile } from '../delete-immobiles'
import { listImmobiles } from '../list-immobiles'
import { upadateImmobile } from '../update-immobiles'
import { uploadImmobile } from '../upload-immobiles'
import {
  schemaCreate,
  schemaDelete,
  schemaListagem,
  schemaUpdate,
} from './schema-docs'
import path from 'path'

export async function imovelRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/imovel', { ...schemaCreate }, createImmobile)

  app.post('/imovel/:id/images', uploadImmobile)

  app.put('/imovel/:id', schemaUpdate, upadateImmobile)

  app.get('/list', schemaListagem, listImmobiles)

  app.delete('/imovel/:id', schemaDelete, deleteImmobile)
}

export async function imageRoute(app: FastifyInstance) {
  app.get('/public/immobiles/images/:id', function (req, reply) {
    const { id } = req.params as { id: string }
    const filename = `${id.replace(/\s/g, '%20')}.jpg`
    const imagePath = path.join(__dirname, 'public/images/immobiles', filename)
    console.log('ID', id)
    console.log('Image path:', imagePath)

    reply.sendFile(filename, path.join(filename, imagePath))
  })
}
