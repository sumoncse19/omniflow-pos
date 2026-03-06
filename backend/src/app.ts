import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import menuRoutes from './routes/menu.routes'
import { errorHandler } from './middleware/errors'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'OmniFlow POS server is running' })
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/menu', menuRoutes)

app.use(errorHandler)

export default app
