import { FastifyReply, FastifyRequest } from 'fastify'

// type Role = 'ADMIN' | 'CORRETOR' | 'COMPRADOR'
export function verifyUserRole(roleToVerify: 'ADMIN' | 'CORRETOR') {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    console.log(roleToVerify)
    const role = request.user?.role ?? null
    console.log(role, 'ROLE')

    if (role !== roleToVerify) {
      return reply.status(401).send({ message: 'Unauthorizedasdasda.' })
    }
  }
}
