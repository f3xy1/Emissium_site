const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/auth')

const app = express()
const PORT = process.env.PORT || 3001

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}))

app.use(express.json())

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes)

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '0.1' })
})

// ── Start ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Emissium server running on http://localhost:${PORT}`)
})