import http from 'http'
import app from './app.js'
import dotenv from 'dotenv'
import { connectDB } from './config/connectDB.js'

dotenv.config({ path: '../.env' })
connectDB()

const port = process.env.BACKEND_PORT || 3000
const server = http.createServer(app)
const host = process.env.BACKEND_HOST_PORT || '127.0.0.1'

server.listen(port, host, () => {
  console.log(`Server is running at ${host}:${port}`)
})
