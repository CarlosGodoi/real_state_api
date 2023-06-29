import { verifyJWT } from '@/http/middlewares/verify-jwt'

export const registerSchema = {
  schema: {
    description: 'Criação de Usuario ',
    tags: ['User'],
    body: {
      type: 'object',
      properties: {
        nome: { type: 'string' },
        email: { type: 'string' },
        perfil: { type: 'string' },
        telefone: { type: 'string' },
        senha: { type: 'string' },
      },
    },
    security: [{ Bearer: [] }],
    response: {
      201: {
        description: 'Criado  sucesso',
        type: 'object',
        properties: {
          nome: { type: 'string' },
          email: { type: 'string' },
          perfil: { type: 'string' },
          telefone: { type: 'string' },
          senha: { type: 'string' },
        },
      },
      400: {
        description: 'Erro',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
}

export const refreshSchema = {
  schema: {
    description: 'Refresh Token ',
    tags: ['User'],
    body: {
      type: 'object',
      properties: {
        refresh: { type: 'string' },
      },
    },
    security: [{ Bearer: [] }],
    response: {
      201: {
        description: 'Atenticado com  sucesso',
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
      },
      400: {
        description: 'Erro',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
}

export const authenticateSchema = {
  schema: {
    description: 'Autenticação ',
    tags: ['Auth'],
    body: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        senha: { type: 'string' },
      },
    },
    response: {
      200: {
        description: 'Autenticado com  sucesso',
        type: 'object',
        properties: {
          token: { type: 'string' },
        },
      },
      400: {
        description: 'Erro',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
}

export const profileSchema = {
  onRequest: [verifyJWT],
  schema: {
    description: 'Perfil',
    tags: ['Profile'],
    security: [{ Bearer: [] }],
    response: {
      200: {
        description: 'Perfil encontrado com sucesso',
        type: 'object',
        properties: {
          nome: { type: 'string' },
          email: { type: 'string' },
          perfil: { type: 'string' },
          senha: { type: 'string' },
          telefone: { type: 'string' },
          createdAt: { type: 'string' },
        },
      },
      400: {
        description: 'Erro',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
}
