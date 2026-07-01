import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiRegister } from '../api/auth'
import './LoginForm.css'
import './RegisterForm.css'

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function RegisterForm() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    login: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Клиентская валидация
    if (!form.login || !form.email || !form.password || !form.confirmPassword) {
      setError('Заполните все поля')
      return
    }

    if (form.password !== form.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    if (form.password.length < 8) {
      setError('Пароль должен быть не менее 8 символов')
      return
    }

    setLoading(true)
    try {
      await apiRegister(form)
      setSuccess('Аккаунт создан! Перенаправляем на вход...')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Индикатор силы пароля
  const getPasswordStrength = (pwd) => {
    if (!pwd) return null
    if (pwd.length < 8) return { level: 1, label: 'Слабый', color: '#ef4444' }
    if (pwd.length < 12) return { level: 2, label: 'Средний', color: '#f59e0b' }
    return { level: 3, label: 'Надёжный', color: '#22c55e' }
  }

  const strength = getPasswordStrength(form.password)

  return (
    <div className="login-form__wrapper">
      <div className="login-form__card">
        <h1 className="login-form__title">
          <span className="login-form__title-text">Регистрация</span>
        </h1>

        <form className="login-form" onSubmit={handleSubmit}>

          {/* Ошибка */}
          {error && (
            <div className="login-form__error">
              <span>⚠ {error}</span>
            </div>
          )}

          {/* Успех */}
          {success && (
            <div className="login-form__success">
              <span>✓ {success}</span>
            </div>
          )}

          {/* Логин */}
          <div className="login-form__field">
            <label className="login-form__label" htmlFor="reg-login">Логин</label>
            <div className="login-form__input-wrapper">
              <span className="login-form__input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="reg-login"
                name="login"
                type="text"
                className="login-form__input"
                placeholder="Придумайте логин"
                value={form.login}
                onChange={handleChange}
                autoComplete="username"
                disabled={loading}
              />
            </div>
            <span className="login-form__hint">3–32 символа: буквы, цифры, . _ -</span>
          </div>

          {/* Email */}
          <div className="login-form__field">
            <label className="login-form__label" htmlFor="reg-email">Email</label>
            <div className="login-form__input-wrapper">
              <span className="login-form__input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="login-form__input"
                placeholder="Введите email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={loading}
              />
            </div>
          </div>

          {/* Пароль */}
          <div className="login-form__field">
            <label className="login-form__label" htmlFor="reg-password">Пароль</label>
            <div className="login-form__input-wrapper">
              <span className="login-form__input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="reg-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                className="login-form__input login-form__input--password"
                placeholder="Придумайте пароль"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="login-form__eye"
                onClick={() => setShowPassword(p => !p)}
                aria-label="Показать пароль"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>

            {/* Индикатор силы */}
            {strength && (
              <div className="register-form__strength">
                <div className="register-form__strength-bars">
                  {[1, 2, 3].map(lvl => (
                    <div
                      key={lvl}
                      className="register-form__strength-bar"
                      style={{
                        background: lvl <= strength.level ? strength.color : 'var(--border-color)'
                      }}
                    />
                  ))}
                </div>
                <span
                  className="register-form__strength-label"
                  style={{ color: strength.color }}
                >
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Подтверждение пароля */}
          <div className="login-form__field">
            <label className="login-form__label" htmlFor="reg-confirm">Подтверждение пароля</label>
            <div className="login-form__input-wrapper">
              <span className="login-form__input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </span>
              <input
                id="reg-confirm"
                name="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className={`login-form__input login-form__input--password ${
                  form.confirmPassword && form.password !== form.confirmPassword
                    ? 'login-form__input--error'
                    : ''
                } ${
                  form.confirmPassword && form.password === form.confirmPassword
                    ? 'login-form__input--valid'
                    : ''
                }`}
                placeholder="Повторите пароль"
                value={form.confirmPassword}
                onChange={handleChange}
                autoComplete="new-password"
                disabled={loading}
              />
              <button
                type="button"
                className="login-form__eye"
                onClick={() => setShowConfirm(p => !p)}
                aria-label="Показать пароль"
              >
                {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Кнопка */}
          <button
            type="submit"
            className="login-form__submit"
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            {loading
              ? <span className="login-form__spinner"></span>
              : 'Зарегистрироваться'
            }
          </button>

          {/* Ссылка на вход */}
          <p className="login-form__register">
            Уже есть аккаунт?{' '}
            <Link to="/login" className="login-form__register-link">
              Войти
            </Link>
          </p>

        </form>
      </div>
      <div className="login-form__glow"></div>
    </div>
  )
}

export default RegisterForm