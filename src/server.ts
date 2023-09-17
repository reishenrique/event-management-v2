import fastify from 'fastify'
import 'dotenv/config'

export const app = fastify()

app.listen({ host: '0.0.0.0', port: 3000 }).then(() => {
  console.log(`Server Runnnig on port 3000`)
})
