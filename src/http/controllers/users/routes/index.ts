import { FastifyInstance } from 'fastify'
import { register } from '../register'
import { refresh } from '../refresh'
import { authenticate } from '../authenticate'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { profile } from '../profile'
import {
  authenticateSchema,
  profileSchema,
  refreshSchema,
  registerSchema,
} from './schema-docs'

export async function usersRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJWT)

  app.post('/users', registerSchema, register)

  app.post('/token/refresh', refreshSchema, refresh)
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticateSchema, authenticate)

  app.get('/me', profileSchema, profile)
}
