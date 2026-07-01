const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../db')

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'emissium_super_secret_change_in_prod'
const SALT_ROUNDS = 12

// ── Валидация ────────────────────────────────────────────────
function validateLogin(value) {
  // Логин: 3-32 символа, буквы/цифры/._-
  return /^[a-zA-Z0-9._-]{3,32}$/.test(value)
}

function validateEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function validatePassword(value) {
  // Минимум 8 символов
  return value && value.length >= 8
}

// ── POST /api/auth/register ──────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const { login, email, password, confirmPassword } = req.body

    // Валидация полей
    if (!login || !email || !password || !confirmPassword) {
      return res.status(400).json({ error: 'Все поля обязательны' })
    }

    if (!validateLogin(login)) {
      return res.status(400).json({
        error: 'Логин: 3–32 символа, только буквы, цифры, . _ -'
      })
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Некорректный email' })
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        error: 'Пароль должен быть не менее 8 символов'
      })
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: 'Пароли не совпадают' })
    }

    // Проверяем уникальность
    const existingLogin = db
      .prepare('SELECT uid FROM users WHERE login = ?')
      .get(login)

    if (existingLogin) {
      return res.status(409).json({ error: 'Логин уже занят' })
    }

    const existingEmail = db
      .prepare('SELECT uid FROM users WHERE email = ?')
      .get(email)

    if (existingEmail) {
      return res.status(409).json({ error: 'Email уже используется' })
    }

    // Хэшируем пароль
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    // Записываем пользователя
    const result = db
      .prepare(
        'INSERT INTO users (login, email, password, version) VALUES (?, ?, ?, ?)'
      )
      .run(login, email.toLowerCase(), hashedPassword, 'none')

    return res.status(201).json({
      message: 'Регистрация успешна',
      uid: result.lastInsertRowid
    })

  } catch (err) {
    console.error('[register]', err)
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

// ── POST /api/auth/login ─────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Заполните все поля' })
    }

    // Ищем по логину или email
    const user = db
      .prepare('SELECT * FROM users WHERE login = ? OR email = ?')
      .get(identifier, identifier.toLowerCase())

    if (!user) {
      return res.status(401).json({ error: 'Неверный логин или пароль' })
    }

    // Сравниваем пароль с хэшем
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Неверный логин или пароль' })
    }

    // Генерируем JWT
    // rememberMe = true  → токен живёт 30 дней
    // rememberMe = false → токен живёт 24 часа
    const expiresIn = rememberMe ? '30d' : '24h'

    const token = jwt.sign(
      {
        uid: user.uid,
        login: user.login,
        version: user.version
      },
      JWT_SECRET,
      { expiresIn }
    )

    return res.status(200).json({
      message: 'Вход выполнен',
      token,
      rememberMe,
      user: {
        uid: user.uid,
        login: user.login,
        email: user.email,
        version: user.version
      }
    })

  } catch (err) {
    console.error('[login]', err)
    return res.status(500).json({ error: 'Внутренняя ошибка сервера' })
  }
})

// ── GET /api/auth/me ─────────────────────────────────────────
// Проверка токена — кто я?
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Нет токена' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const user = db
      .prepare(`
        SELECT uid, login, email, version, sub_started, sub_expires
        FROM users WHERE uid = ?
      `)
      .get(payload.uid)

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' })
    }

    return res.json({ user })
  } catch (err) {
    return res.status(401).json({ error: 'Токен недействителен' })
  }
})

// ── PATCH /api/auth/email ─────────────────────────────────────
// Смена email
router.patch('/email', (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Нет токена' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const { email } = req.body

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ error: 'Некорректный email' })
    }

    const existing = db
      .prepare('SELECT uid FROM users WHERE email = ? AND uid != ?')
      .get(email.toLowerCase(), payload.uid)

    if (existing) {
      return res.status(409).json({ error: 'Email уже используется' })
    }

    db.prepare('UPDATE users SET email = ? WHERE uid = ?')
      .run(email.toLowerCase(), payload.uid)

    return res.json({ message: 'Email обновлён', email: email.toLowerCase() })
  } catch (err) {
    return res.status(401).json({ error: 'Токен недействителен' })
  }
})

// ── PATCH /api/auth/password ──────────────────────────────────
// Смена пароля
router.patch('/password', async (req, res) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Нет токена' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Заполните все поля' })
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ error: 'Новый пароль должен быть не менее 8 символов' })
    }

    const user = db
      .prepare('SELECT * FROM users WHERE uid = ?')
      .get(payload.uid)

    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) {
      return res.status(401).json({ error: 'Неверный текущий пароль' })
    }

    const hashed = await bcrypt.hash(newPassword, SALT_ROUNDS)
    db.prepare('UPDATE users SET password = ? WHERE uid = ?')
      .run(hashed, payload.uid)

    return res.json({ message: 'Пароль обновлён' })
  } catch (err) {
    return res.status(401).json({ error: 'Токен недействителен' })
  }
})

module.exports = router