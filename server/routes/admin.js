const express = require('express')
const db = require('../db')

const router = express.Router()

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'emissium_is_best'

// ── Middleware: проверка админского ключа ─────────────────────
function adminAuth(req, res, next) {
  const key = req.headers['x-admin-key']
  if (!key || key !== ADMIN_SECRET) {
    return res.status(403).json({ error: 'Доступ запрещён' })
  }
  next()
}

// ── GET /admin/users — список всех пользователей ──────────────
router.get('/users', adminAuth, (req, res) => {
  const users = db
    .prepare(`
      SELECT uid, login, email, version, sub_started, sub_expires, created_at
      FROM users
      ORDER BY uid DESC
    `)
    .all()
  res.json({ users })
})

// ── GET /admin/users/:uid — один пользователь ─────────────────
router.get('/users/:uid', adminAuth, (req, res) => {
  const user = db
    .prepare(`
      SELECT uid, login, email, version, sub_started, sub_expires, created_at
      FROM users WHERE uid = ?
    `)
    .get(req.params.uid)

  if (!user) return res.status(404).json({ error: 'Пользователь не найден' })
  res.json({ user })
})

// ── POST /admin/subscription — выдать/продлить подписку ───────
router.post('/subscription', adminAuth, (req, res) => {
  const { uid, version, days } = req.body

  if (!uid || !version || !days) {
    return res.status(400).json({ error: 'uid, version и days обязательны' })
  }

  const user = db.prepare('SELECT * FROM users WHERE uid = ?').get(uid)
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' })

  const now = new Date()

  // Если подписка ещё активна — продлеваем от даты окончания
  // Если нет — от текущего момента
  let baseDate = now
  if (user.sub_expires) {
    const existing = new Date(user.sub_expires)
    if (existing > now) baseDate = existing
  }

  const expires = new Date(baseDate)
  expires.setDate(expires.getDate() + Number(days))

  db.prepare(`
    UPDATE users
    SET version = ?, sub_started = ?, sub_expires = ?
    WHERE uid = ?
  `).run(
    version,
    now.toISOString(),
    expires.toISOString(),
    uid
  )

  const updated = db
    .prepare('SELECT uid, login, email, version, sub_started, sub_expires FROM users WHERE uid = ?')
    .get(uid)

  res.json({ message: 'Подписка выдана', user: updated })
})

// ── DELETE /admin/subscription/:uid — сбросить подписку ───────
router.delete('/subscription/:uid', adminAuth, (req, res) => {
  const user = db.prepare('SELECT uid FROM users WHERE uid = ?').get(req.params.uid)
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' })

  db.prepare(`
    UPDATE users SET version = 'none', sub_started = NULL, sub_expires = NULL
    WHERE uid = ?
  `).run(req.params.uid)

  res.json({ message: 'Подписка сброшена' })
})

module.exports = { router, adminAuth }