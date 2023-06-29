import { UsersRepository } from '@/repositories/users-repository'
import { Role, Usuario } from '@prisma/client'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'
import { InvalidCredentialsError } from '../errors/invalid-credentials-error'

interface RegisterUseCaseRequest {
  nome: string
  email: string
  senha: string
  telefone?: string
  perfil: Role
}

interface RegisterUseCaseResponse {
  user: Usuario
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    nome,
    email,
    perfil,
    telefone,
    senha,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const password_hash = await hash(senha, 6)

    const emailExists = await this.usersRepository.findByEmail(email)

    if (emailExists) {
      throw new UserAlreadyExistsError()
    }

    if (perfil === 'CORRETOR' || perfil === 'ADMIN') {
      throw new InvalidCredentialsError()
    }

    const user = await this.usersRepository.create({
      nome,
      email,
      perfil,
      telefone,
      senha: password_hash,
    })

    return { user }
  }
}
