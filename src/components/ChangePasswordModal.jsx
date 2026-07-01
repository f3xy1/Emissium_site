import React, { useState } from 'react'
import { apiChangePassword } from '../api/auth'
import './ChangePasswordModal.css'

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function ChangePasswordModal({ onClose }) {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false
  })
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

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setError('Заполните все поля')
      return
    }

    if (form.newPassword.length < 8) {
      setError('Новый пароль должен быть не менее 8 символов')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Пароли не совпадают')
      return
    }

    setLoading(true)
    try {
      await apiChangePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      })
      setSuccess('Пароль успешно изменён!')
      setTimeout(onClose, 1500)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Закрытие по клику на оверлей
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal__header">
          <h2 className="modal__title">Смена пароля</h2>
          <button className="modal__close" onClick={onClose} aria-label="Закрыть">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <form className="modal__form" onSubmit={handleSubmit}>

          {error && (
            <div className="modal__error">⚠ {error}</div>
          )}
          {success && (
            <div className="modal__success">✓ {success}</div>
          )}

          {/* Текущий пароль */}
          {[
            { name: 'currentPassword', label: 'Текущий пароль',    showKey: 'current' },
            { name: 'newPassword',     label: 'Новый пароль',       showKey: 'new' },
            { name: 'confirmPassword', label: 'Подтверждение',      showKey: 'confirm' }
          ].map(field => (
            <div className="modal__field" key={field.name}>
              <label className="modal__label">{field.label}</label>
              <div className="modal__input-wrapper">
                <input
                  type={show[field.showKey] ? 'text' : 'password'}
                  name={field.name}
                  className="modal__input"
                  value={form[field.name]}
                  onChange={handleChange}
                  disabled={loading}
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="modal__eye"
                  onClick={() => setShow(prev => ({
                    ...prev,
                    [field.showKey]: !prev[field.showKey]
                  }))}
                >
                  {show[field.showKey] ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          ))}

          <button
            type="submit"
            className="modal__submit"
            disabled={loading}
          >
            {loading
              ? <span className="login-form__spinner"></span>
              : 'Сохранить'
            }
          </button>

        </form>
      </div>
    </div>
  )
}

export default ChangePasswordModal