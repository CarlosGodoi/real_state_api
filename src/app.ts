import fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'
import { SwaggerTheme } from 'swagger-themes'
import multipart from '@fastify/multipart'
import staticFiles from '@fastify/static'
import path from 'path'
import cors from '@fastify/cors'

import { ZodError } from 'zod'
import { env } from './env'
import { routes } from './http/routes'

export const app = fastify()

app.register(cors, {
  // put your options here
})

app.register(swagger, {
  swagger: {
    info: {
      title: 'Test swagger',
      description: 'Testing the Fastify swagger API',
      version: '0.1.0',
    },
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here',
    },
    host: 'localhost:3334',
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
    securityDefinitions: {
      Bearer: {
        name: 'Bearer',
        type: 'apiKey',
        in: 'header',
      },
    },
  },
})

app.register(swaggerUI, {
  routePrefix: '/api-docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: false,
  },
  uiHooks: {
    onRequest: function (request, reply, next) {
      next()
    },
    preHandler: function (request, reply, next) {
      next()
    },
  },
  staticCSP: true,
  transformStaticCSP: (header) => header,
  transformSpecification: (swaggerObject, request, reply) => {
    return swaggerObject
  },
  transformSpecificationClone: true,
  theme: {
    css: [
      {
        filename: 'theme.css',
        content: new SwaggerTheme('v3').getBuffer('dark'),
      },
    ],
  },
})

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: {
    cookieName: 'refreshToken',
    signed: false,
  },
  sign: {
    expiresIn: '10m',
  },
})

app.register(multipart, {
  logLevel: 'error',
  throwFileSizeLimit: true,
  limits: {
    fileSize: 100 * 1024 * 1024,
    fieldSize: 100 * 1024 * 1024,
  },
})

app.register(fastifyCookie)

// app.register(staticFiles, {
//   root: path.join(__dirname, '..', 'public'), // tem que retornar uma pasta para acessar a public que está fora da pasta src
//   prefix: '/public',
// })

app.register(routes)

app.setErrorHandler((error, _, reply) => {
  console.log(error)
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to on external tool like DataDog/NewRelic/Sentry
  }
  return reply.status(500).send({ message: 'Internal server error.' })
})
