import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes.js'
import bookRoutes from './routes/bookRoutes.js'

const app = express()

// CLIENT_ORIGIN may hold one or several comma-separated origins.
// Trailing slashes are stripped so "https://site.netlify.app/" still matches.
const origins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map(s => s.trim().replace(/\/$/, ''))
  .filter(Boolean)

app.use(cors({ origin: origins.length ? origins : true }))
app.use(express.json())

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)

app.use((req, res) => res.status(404).json({ message: 'Route not found.' }))

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ message: 'Invalid JSON body.' })
  console.error(err)
  res.status(500).json({ message: 'Something went wrong on the server.' })
})

export default app
