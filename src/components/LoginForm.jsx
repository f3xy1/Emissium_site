import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { apiLogin, saveToken } from '../api/auth'
import { useAuth } from '../context/AuthContext'
import './LoginForm.css'

function LoginForm() {
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!identifier.trim() || !password) {
      setError('Заполните все поля')
      return
    }

    setLoading(true)
    try {
      const data = await apiLogin({ identifier, password, rememberMe })
      saveToken(data.token, rememberMe)
      setUser(data.user)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-form__wrapper">
      <div className="login-form__card">
        <h1 className="login-form__title">
          <span className="login-form__title-text">Авторизация</span>
        </h1>

        <form className="login-form" onSubmit={handleSubmit}>

          {/* Ошибка */}
          {error && (
            <div className="login-form__error">
              <span>⚠ {error}</span>
            </div>
          )}

          {/* Логин / Email */}
          <div className="login-form__field">
            <label className="login-form__label" htmlFor="login">Логин</label>
            <div className="login-form__input-wrapper">
              <span className="login-form__input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input
                id="login"
                type="text"
                className="login-form__input"
                placeholder="Введите логин или e-mail"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </div>
          </div>

          {/* Пароль */}
          <div className="login-form__field">
            <label className="login-form__label" htmlFor="password">Пароль</label>
            <div className="login-form__input-wrapper">
              <span className="login-form__input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="login-form__input login-form__input--password"
                placeholder="Введите пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
              <button
                type="button"
                className="login-form__eye"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Запомнить / Забыли пароль */}
          <div className="login-form__row">
            <label className="login-form__remember">
              <input
                type="checkbox"
                className="login-form__checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
              />
              <span className="login-form__checkbox-custom"></span>
              <span className="login-form__remember-text">Запомнить меня</span>
            </label>

            <a href="#" className="login-form__forgot">Забыли пароль?</a>
          </div>

          {/* Кнопка */}
          <button
            type="submit"
            className="login-form__submit"
            disabled={loading}
          >
            {loading ? (
              <span className="login-form__spinner"></span>
            ) : (
              'Войти'
            )}
          </button>

          {/* Регистрация */}
          <p className="login-form__register">
            Нет аккаунта?{' '}
            <Link to="/register" className="login-form__register-link">
              Регистрация
            </Link>
          </p>

        </form>
      </div>
      <div className="login-form__glow"></div>
    </div>
  )
}

export default LoginForm