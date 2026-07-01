const BASE_URL = 'http://localhost:3001/api'

export function saveToken(token, rememberMe) {
  if (rememberMe) {
    localStorage.setItem('emissium_token', token)
    sessionStorage.removeItem('emissium_token')
  } else {
    sessionStorage.setItem('emissium_token', token)
    localStorage.removeItem('emissium_token')
  }
}

export function getToken() {
  return (
    localStorage.getItem('emissium_token') ||
    sessionStorage.getItem('emissium_token') ||
    null
  )
}

export function removeToken() {
  localStorage.removeItem('emissium_token')
  sessionStorage.removeItem('emissium_token')
}

// ── Auth ─────────────────────────────────────────────────────
export async function apiRegister({ login, email, password, confirmPassword }) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ login, email, password, confirmPassword })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка регистрации')
  return data
}

export async function apiLogin({ identifier, password, rememberMe }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password, rememberMe })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка входа')
  return data
}

export async function apiGetMe() {
  const token = getToken()
  if (!token) throw new Error('Нет токена')
  const res = await fetch(`${BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка')
  return data
}

// ── Profile ───────────────────────────────────────────────────
export async function apiChangeEmail(email) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/auth/email`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ email })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка')
  return data
}

export async function apiChangePassword({ currentPassword, newPassword }) {
  const token = getToken()
  const res = await fetch(`${BASE_URL}/auth/password`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ currentPassword, newPassword })
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Ошибка')
  return data
}