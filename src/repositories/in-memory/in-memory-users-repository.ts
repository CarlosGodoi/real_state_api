import { Usuario, Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class InMemoryUsersRepository implements UsersRepository {
  public items: Usuario[] = []

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!email) {
      return null
    }

    return user || null
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!id) {
      return null
    }

    return user || null
  }

  async create(data: Prisma.UsuarioCreateInput) {
    const user = {
      id: 'user-01',
      nome: data.nome,
      email: data.email,
      perfil: data.perfil,
      telefone: data.telefone || null,
      createdAt: new Date(),
      senha: data.senha,
    }

    this.items.push(user)

    return user
  }
}
