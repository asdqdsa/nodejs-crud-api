import http, { IncomingMessage, ServerResponse } from 'node:http'
import dotenv from 'dotenv'

console.log('Booting...')

dotenv.config()
const PORT = process.env.PORT || 4111

const server = http.createServer((_: IncomingMessage, res: ServerResponse) => {
  res.writeHead(200, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      data: 'Henlo ',
    })
  )
})

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
