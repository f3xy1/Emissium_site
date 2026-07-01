import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiChangeEmail, apiChangePassword } from '../api/auth'
import ChangePasswordModal from './ChangePasswordModal'
import './ProfileCard.css'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleString('ru-RU', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

function ProfileCard() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()

  const [emailEdit, setEmailEdit] = useState(false)
  const [emailValue, setEmailValue] = useState(user?.email || '')
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState('')

  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleEmailSave = async () => {
    setEmailError('')
    if (emailValue === user.email) {
      setEmailEdit(false)
      return
    }
    setEmailLoading(true)
    try {
      const data = await apiChangeEmail(emailValue)
      setUser(prev => ({ ...prev, email: data.email }))
      setEmailEdit(false)
    } catch (err) {
      setEmailError(err.message)
    } finally {
      setEmailLoading(false)
    }
  }

  const handleEmailCancel = () => {
    setEmailValue(user.email)
    setEmailError('')
    setEmailEdit(false)
  }

  if (!user) return null

  const hasSubscription = user.version && user.version !== 'none'

  return (
    <div className="profile-card__wrapper">
      <div className="profile-card">

        {/* Заголовок */}
        <h1 className="profile-card__title neon-text">Личный кабинет</h1>

        {/* Таблица полей */}
        <div className="profile-card__table">

          {/* UID */}
          <div className="profile-card__row">
            <div className="profile-card__key">UID</div>
            <div className="profile-card__value">{user.uid}</div>
          </div>

          {/* Логин */}
          <div className="profile-card__row">
            <div className="profile-card__key">Логин</div>
            <div className="profile-card__value">{user.login}</div>
          </div>

          {/* Email */}
          <div className="profile-card__row">
            <div className="profile-card__key">Email</div>
            <div className="profile-card__value profile-card__value--email">
              {emailEdit ? (
                <div className="profile-card__email-edit">
                  <input
                    type="email"
                    className="profile-card__email-input"
                    value={emailValue}
                    onChange={e => {
                      setEmailValue(e.target.value)
                      setEmailError('')
                    }}
                    autoFocus
                    disabled={emailLoading}
                  />
                  <div className="profile-card__email-actions">
                    {emailError && (
                      <span className="profile-card__email-error">{emailError}</span>
                    )}
                    <button
                      className="profile-card__btn-save"
                      onClick={handleEmailSave}
                      disabled={emailLoading}
                    >
                      {emailLoading ? '...' : 'Сохранить'}
                    </button>
                    <button
                      className="profile-card__btn-cancel"
                      onClick={handleEmailCancel}
                      disabled={emailLoading}
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <span>{user.email}</span>
                  <button
                    className="profile-card__edit-btn"
                    onClick={() => {
                      setEmailValue(user.email)
                      setEmailEdit(true)
                    }}
                    aria-label="Изменить email"
                    title="Изменить email"
                  >
                    {/* Иконка карандаша */}
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Подписка */}
          <div className="profile-card__row">
            <div className="profile-card__key">Подписка</div>
            <div className="profile-card__value">
              {hasSubscription ? (
                <span className="profile-card__sub profile-card__sub--active">
                  {user.version}
                </span>
              ) : (
                <span className="profile-card__sub profile-card__sub--none">
                  Не приобретена
                </span>
              )}
            </div>
          </div>

          {/* Окончание подписки */}
          <div className="profile-card__row">
            <div className="profile-card__key">Окончание</div>
            <div className="profile-card__value">
              {hasSubscription
                ? formatDate(user.sub_expires)
                : '—'
              }
            </div>
          </div>

        </div>

        {/* Кнопки действий */}
        <div className="profile-card__actions">
          <button
            className="profile-card__action-btn profile-card__action-btn--secondary"
            onClick={() => setShowPasswordModal(true)}
          >
            Сменить пароль
          </button>

          <button className="profile-card__action-btn profile-card__action-btn--primary">
            {hasSubscription ? 'Продлить подписку' : 'Купить подписку'}
          </button>

          <button
            className="profile-card__action-btn profile-card__action-btn--danger"
            onClick={handleLogout}
          >
            Выйти
          </button>
        </div>

      </div>

      {/* Декоративное свечение */}
      <div className="profile-card__glow"></div>

      {/* Модалка смены пароля */}
      {showPasswordModal && (
        <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  )
}

export default ProfileCard