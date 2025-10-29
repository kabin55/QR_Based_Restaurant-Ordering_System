import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import { router as userRouter } from './routes/userRoute.js'
import { router as adminRouter } from './routes/adminRoute.js'
import { protectedRoute } from './middleware/token.js'

const app = express()
dotenv.config({ path: '../.env' })

app.get('/', (req, res) => {
  res.send('Server is running!')
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
)

app.use(cookieParser())

app.use('/api', userRouter)
app.use('/api/admin', protectedRoute, adminRouter)

export default app
