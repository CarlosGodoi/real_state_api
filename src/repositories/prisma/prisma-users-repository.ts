import { prisma } from '@/lib/prisma'
import { UsersRepository } from '../users-repository'
import { Prisma } from '@prisma/client'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const user = await prisma.usuario.findUnique({
      where: {
        email,
      },
    })
    return user
  }

  async findById(id: string) {
    const user = await prisma.usuario.findFirst({
      where: {
        id,
      },
    })

    return user
  }

  async create(data: Prisma.UsuarioCreateInput) {
    const user = await prisma.usuario.create({
      data,
    })

    return user
  }
}
