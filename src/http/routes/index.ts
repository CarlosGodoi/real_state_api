import { FastifyInstance } from 'fastify'
import { authRoutes, usersRoutes } from '../controllers/users/routes'
import { imovelRoutes, imageRoute } from '../controllers/immobiles/routes'

export async function routes(app: FastifyInstance) {
  app.register(authRoutes)
  app.register(usersRoutes)
  app.register(imovelRoutes)
  app.register(imageRoute)
}
