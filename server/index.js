const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')
const { router: adminRouter } = require('./routes/admin')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3002'],
  credentials: true
}))

app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/admin', adminRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1' })
})

app.listen(PORT, () => {
  console.log(`Emissium API → http://localhost:${PORT}`)
})