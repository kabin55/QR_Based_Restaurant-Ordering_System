import express from 'express'
// import cors from 'cors'
import cookieParser from 'cookie-parser'

import { router } from './routes/userRoute.js'

const app = express()

app.get('/', (req, res) => {
  res.send('Server is running!')
})

// app.use(cors())
app.use(express.json())
app.use(cookieParser())

app.use('/api', router)

export default app
