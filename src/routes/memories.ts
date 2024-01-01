import { FastifyInstance } from "fastify"
import { prisma } from '../lib/prisma'
import { string, z } from 'zod'

export async function memoriesRoutes(app: FastifyInstance) {
    app.get('/memories', async () => {
        const memories = await prisma.memory.findMany({
            orderBy: {
                createdAt: "asc",
            },
        })

        return memories.map(memory => {
            return {
                id: memory.id,
                coverUrl: memory.coverUrl,
                excerpt: memory.content.substring(0, 115).concat('...')
            }
            // mapeio a variavel momories, jogo para memory, pego id, cover, e na excerpt pego o conteudo do content porem coloco em uma substring que vai mostrar de 0 a 115 caracteres na tela do meu usuario e vai concatenar com ...
        })
    }) 
    
    app.get('/memories/:id', async (request) => {
        // const { id } = request.params
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })
        // O meu params é um objeto (z.object), e dentro dele eu espero que tenha um id to tipo string (id: z.string()e posso falar tmb que ele é um uuid usando .uuid())
        
        const { id } = paramsSchema.parse(request.params)
        // Estou pegando o meu request.params, passando para o meu paramsSchema para o zod fazer uma validação para ver se esse objeto segue a mesma (assinatura, schema, estrutura do dado). Se sim ele retorna o id. Se não ele dispara um erro
        
        const memory = await prisma.memory.findUniqueOrThrow({
            where: {
                id,
            }
        })
        // findUniqueOrThrow(). Encontre a memoria com esse id se não dispare um erro. where: {id,}, eu quero dizer aqui que, eu quero uma memoria unica que o id seja igual o id do params

        return memory
    })
      
    app.post('/memories', async (request) => {
        const bodySchema = z.object({
            content: z.string(),
            coverUrl: z.string(),
            isPublic: z.coerce.boolean().default(false),
        })
        // Pegando o objeto do body e testando. o novo é a função coerce do Zod, que vai converter o tipo da variavel que é enviada pro backend atraves do formulario, por exemplo, o formulario html nao trabalha com true e false, e sim 0, null, undefined, essa função faz com que tudo que venha 0 do html, se torne false aqui no backend

        const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

        const memory = await prisma.memory.create({
            data: {
                content,
                coverUrl,
                isPublic,
                userId: 'f4fc0005-6964-4cec-a62a-f3ab3193f6ed',
            },
        })

        return memory
      })

    app.put('/memories/:id', async (request) => {
            const paramsSchema = z.object({
                id: z.string().uuid(),
            })

            const { id } = paramsSchema.parse(request.params)

            const bodySchema = z.object({
                content: z.string(),
                coverUrl: z.string(),
                isPublic: z.coerce.boolean().default(false),
            })

            const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

            const memory = await prisma.memory.update({
                where: {
                    id,
                },
                data: {
                    content,
                    coverUrl,
                    isPublic,
                },
            })

            return memory
      })
      
    app.delete('/memories/:id', async (request) => {
        const  paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        await prisma.memory.delete({
            where: {
                id,
            },
        })
    })
}
// Importando meu app que é um fastify e eu preciso declarar que tipo dele, que é fastifyInstance