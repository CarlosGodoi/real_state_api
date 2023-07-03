import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

// type Role = 'ADMIN' | 'CORRETOR' | 'COMPRADOR'
export function verifyUserRole(roleToVerify: 'ADMIN' | 'CORRETOR') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    console.log(roleToVerify)
    const role = request.user?.role ?? null

    console.log(role, 'ROLE')

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}

export function validateUserRegister(app: FastifyInstance) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization?.split('Bearer ')[1] || ''
    const { perfil } = request.body as {
      perfil: 'ADMIN' | 'CORRETOR' | 'COMPRADOR'
    }

    if (token) {
      const { role } = app.jwt.decode(token) as {
        role: 'ADMIN' | 'CORRETOR' | 'COMPRADOR'
      }
      if (role === 'CORRETOR')
        return reply.status(403).send({ message: 'Permision denied' })

      if (role === 'ADMIN' && perfil === 'COMPRADOR') {
        return reply.status(403).send({ message: 'Permision denied.' })
      }
    }

    if (perfil !== 'COMPRADOR') {
      return reply.status(403).send({ message: 'Unauthorized.' })
    }
  }
}
