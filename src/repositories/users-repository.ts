import { Prisma, Usuario } from '@prisma/client'

export interface UsersRepository {
  findByEmail(email: string): Promise<Usuario | null>
  findById(id: string): Promise<Usuario | null>
  create(data: Prisma.UsuarioCreateInput): Promise<Usuario>
}
