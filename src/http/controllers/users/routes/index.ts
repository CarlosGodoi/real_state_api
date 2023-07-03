import { FastifyInstance } from 'fastify'
import { register } from '../register'
import { refresh } from '../refresh'
import { authenticate } from '../authenticate'
// import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { profile } from '../profile'
import {
  authenticateSchema,
  profileSchema,
  refreshSchema,
  registerSchema,
} from './schema-docs'
import { validateUserRegister } from '@/http/middlewares/verify-user-role'
import { verifyJWT } from '@/http/middlewares/verify-jwt'

export async function usersRoutes(app: FastifyInstance) {
  app.post(
    '/users',
    { ...registerSchema, preHandler: [validateUserRegister(app)] },
    register,
  )

  app.post('/token/refresh', refreshSchema, refresh)
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/sessions', authenticateSchema, authenticate)

  app.get('/me', { ...profileSchema, preHandler: [verifyJWT] }, profile)
}
