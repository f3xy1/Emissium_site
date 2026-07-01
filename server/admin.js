const express = require('express')
const path = require('path')
const { router: adminApiRouter } = require('./routes/admin')

const app = express()
const PORT = process.env.ADMIN_PORT || 3002

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin_secret_change_in_prod'

app.use(express.json())
app.use(express.static(path.join(__dirname, 'admin-panel')))

// API роуты
app.use('/admin', adminApiRouter)

// SPA fallback — отдаём index.html для всех остальных маршрутов
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-panel', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Emissium ADMIN panel → http://localhost:${PORT}`)
  console.log(`Admin key: ${ADMIN_SECRET}`)
})