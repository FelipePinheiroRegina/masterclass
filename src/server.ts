import fastify from 'fastify'
import { memoriesRoutes } from './routes/memories'
import cors from '@fastify/cors'

const app = fastify()

app.register(cors, {
  origin: true, // todas UELs de front-end poderão acessar mpssp back-end
})

app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('✅ Server HTTP está pronto acesse em: http://localhost:3333')
  })
