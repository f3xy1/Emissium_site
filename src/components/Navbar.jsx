import React, { useState, useEffect } from 'react'
import ThemeToggle from './ThemeToggle'
import './Navbar.css'

function Navbar({ theme, toggleTheme }) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => {
    setMobileOpen(false)
  }

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">
        <div className="navbar__left">
          <span className="navbar__version neon-text">v 0.1</span>
        </div>

        <button
          className={`navbar__burger ${mobileOpen ? 'active' : ''}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Меню"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar__right ${mobileOpen ? 'navbar__right--open' : ''}`}>
          <a href="#changelog" className="navbar__link" onClick={handleNavClick}>
            Изменения
          </a>
          <a href="#pricing" className="navbar__link" onClick={handleNavClick}>
            Цены
          </a>
          <a href="#" className="navbar__link navbar__link--cta" onClick={handleNavClick}>
            Вход
          </a>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </nav>
  )
}

export default Navbar