import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { user } = useAuth()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavClick = () => setMobileOpen(false)
  const isHome = location.pathname === '/'

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__container">

        <Link to="/" className="navbar__logo" onClick={handleNavClick}>
          <span className="navbar__logo-name">Emissium</span>
          <span className="navbar__logo-version">0.1</span>
        </Link>

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
          {isHome ? (
            <a href="#changelog" className="navbar__link" onClick={handleNavClick}>
              Изменения
            </a>
          ) : (
            <Link to="/#changelog" className="navbar__link" onClick={handleNavClick}>
              Изменения
            </Link>
          )}

          {isHome ? (
            <a href="#pricing" className="navbar__link" onClick={handleNavClick}>
              Цены
            </a>
          ) : (
            <Link to="/#pricing" className="navbar__link" onClick={handleNavClick}>
              Цены
            </Link>
          )}

          {user ? (
            <Link
              to="/profile"
              className="navbar__link navbar__link--cta"
              onClick={handleNavClick}
            >
              {user.login}
            </Link>
          ) : (
            <Link
              to="/login"
              className="navbar__link navbar__link--cta"
              onClick={handleNavClick}
            >
              Вход
            </Link>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar