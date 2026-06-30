import React from 'react'

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label="Переключить тему"
      title={theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'}
      style={{
        width: '52px',
        height: '28px',
        borderRadius: '14px',
        border: `1px solid var(--border-color)`,
        background: 'var(--toggle-bg)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        padding: '3px',
      }}
    >
      <span
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'var(--neon-primary)',
          boxShadow: `0 0 10px var(--neon-glow)`,
          transition: 'transform 0.3s ease',
          transform: theme === 'dark' ? 'translateX(0)' : 'translateX(24px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '11px',
        }}
      >
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
    </button>
  )
}

export default ThemeToggle