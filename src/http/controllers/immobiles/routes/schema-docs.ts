import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export const schemaCreate = {
  onRequest: [verifyJWT, verifyUserRole('CORRETOR')],
  schema: {
    description: 'Criar imovel',
    tags: ['Auth'],
    security: [{ Bearer: [] }],
    body: {
      type: 'object',
      properties: {
        tipoContrato: { type: 'string' },
        quantiadeQuartos: { type: 'number' },
        area: { type: 'number' },
        preco: { type: 'number' },
        status: { type: 'string' },
        endereco: {
          type: 'object',
          properties: {
            rua: { type: 'string' },
            bairro: { type: 'string' },
            cidade: { type: 'string' },
            numero: { type: 'number' },
            cep: { type: 'string' },
          },
        },
      },
    },
    response: {
      200: {
        description: 'Imovel criado com sucesso',
        type: 'object',
        properties: {
          tipoContrato: { type: 'string' },
          quantiadeQuartos: { type: 'number' },
          area: { type: 'number' },
          preco: { type: 'number' },
          status: { type: 'string' },
          endereco: {
            type: 'object',
            properties: {
              rua: { type: 'string' },
              bairro: { type: 'string' },
              cidade: { type: 'string' },
              numero: { type: 'number' },
              cep: { type: 'string' },
            },
          },
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

export const schemaListagem = {
  schema: {
    description: 'Listar Imóveis',
    tags: ['Imoveis'],
    response: {
      200: {
        type: 'object',
        properties: {
          imoveis: {
            type: 'array',
            item: {
              type: 'object',
              properties: {
                tipoContrato: { type: 'string' },
                quantiadeQuartos: { type: 'number' },
                area: { type: 'number' },
                preco: { type: 'number' },
                status: { type: 'string' },
                endereco: {
                  type: 'object',
                  properties: {
                    rua: { type: 'string' },
                    bairro: { type: 'string' },
                    cidade: { type: 'string' },
                    numero: { type: 'number' },
                    cep: { type: 'string' },
                  },
                },
              },
            },
          },
          total: { type: 'number' },
          totalPage: { type: 'number' },
        },
      },
    },
  },
}

export const schemaDelete = {
  onRequest: [verifyJWT, verifyUserRole('CORRETOR')],
  schema: {
    description: 'Deletar Imóveis',
    tags: ['Auth'],
    security: [{ Bearer: [] }],
    params: {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
    },
    response: {
      200: {
        type: 'object',
      },
    },
  },
}

export const schemaUpdate = {
  onRequest: [verifyJWT, verifyUserRole('CORRETOR')],
  schema: {
    description: 'Atualizar imovel',
    tags: ['Auth'],
    security: [{ Bearer: [] }],
    body: {
      type: 'object',
      properties: {
        tipoContrato: { type: 'string' },
        preco: { type: 'number' },
        status: { type: 'string' },
      },
    },
    response: {
      200: {
        description: 'Imovel atualizado com sucesso',
        type: 'object',
        properties: {
          tipoContrato: { type: 'string' },
          quantiadeQuartos: { type: 'number' },
          area: { type: 'number' },
          preco: { type: 'number' },
          status: { type: 'string' },
          endereco: {
            type: 'object',
            properties: {
              rua: { type: 'string' },
              bairro: { type: 'string' },
              cidade: { type: 'string' },
              numero: { type: 'number' },
              cep: { type: 'string' },
            },
          },
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
