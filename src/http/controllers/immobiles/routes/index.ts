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

export async function imovelRoutes(app: FastifyInstance) {
  app.addHook('preHandler', verifyJWT)

  app.post('/imovel', { ...schemaCreate }, createImmobile)

  app.post('/imovel/images/:id', uploadImmobile)

  app.put('/imovel/:id', schemaUpdate, upadateImmobile)

  app.get('/imoveis', schemaListagem, listImmobiles)

  app.delete('/imovel/:id', schemaDelete, deleteImmobile)
}
