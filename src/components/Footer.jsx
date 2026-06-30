import React from 'react'
import { FaTelegram, FaDiscord, FaGithub, FaVk } from 'react-icons/fa'
import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__socials">
          <a href="#" className="footer__social-link" aria-label="Telegram" title="Telegram">
            <FaTelegram />
          </a>
          <a href="#" className="footer__social-link" aria-label="Discord" title="Discord">
            <FaDiscord />
          </a>
          <a href="#" className="footer__social-link" aria-label="GitHub" title="GitHub">
            <FaGithub />
          </a>
          <a href="#" className="footer__social-link" aria-label="VK" title="VK">
            <FaVk />
          </a>
        </div>

        <div className="footer__legal">
          <a href="#" className="footer__legal-link">
            Пользовательское соглашение
          </a>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© {new Date().getFullYear()} Emissium. Все права защищены.</p>
      </div>
    </footer>
  )
}

export default Footer