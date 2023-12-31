import fastify from 'fastify'

const app = fastify()

app.post('/hello', () => {
  return 'Hellow World!'
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('✅ Server HTTP está pronto acesse em: http://localhost:3333')
  })
