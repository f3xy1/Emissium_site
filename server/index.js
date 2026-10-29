const express = require('express')
const cors = require('cors')
const path = require('path')
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

// In the container, serve the compiled SPA and admin panel from the same origin.
if (process.env.STATIC_DIR) {
  const staticDir = path.resolve(process.env.STATIC_DIR)
  app.use('/admin-panel', express.static(path.join(__dirname, 'admin-panel')))
  app.use(['/api', '/admin'], (req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' })
  })
  app.use(express.static(staticDir))
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`Emissium API → http://localhost:${PORT}`)
})
