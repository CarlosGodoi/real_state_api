import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

// type Role = 'ADMIN' | 'CORRETOR' | 'COMPRADOR'
export function verifyUserRole(roleToVerify: 'ADMIN' | 'CORRETOR') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const role = request.user?.role ?? null

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorized.' })
    }
  }
}

export function validateUserRegister(app: FastifyInstance) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const token = request.headers.authorization?.split('Bearer ')[1] || ''
    const parseRequest = request.body as {
      nome: string
      senha: string
      telefone: string
      email: string
      perfil?: 'ADMIN' | 'CORRETOR' | 'COMPRADOR'
    }

    if (token) {
      if (!parseRequest.perfil)
        return reply.status(403).send({ message: 'Perfil is required.' })

      const { role } = app.jwt.decode(token) as {
        role: 'ADMIN' | 'CORRETOR' | 'COMPRADOR'
      }
      if (role === 'CORRETOR')
        return reply.status(403).send({ message: 'Permision denied' })

      if (role === 'ADMIN' && parseRequest.perfil === 'COMPRADOR') {
        return reply.status(403).send({ message: 'Permision denied.' })
      }
    } else request.body = { ...parseRequest, perfil: 'COMPRADOR' }
  }
}
