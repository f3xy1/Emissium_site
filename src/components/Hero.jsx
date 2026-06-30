import React from 'react'
import './Hero.css'

function Hero() {
  return (
    <section className="hero">
      <div className="hero__container">
        <h1 className="hero__title">
          <span className="hero__title-text">Emissium</span>
        </h1>
        <p className="hero__subtitle">
          Адаптивный бот для комфортного пассивного фарма ресурсов в Lucky Defense
        </p>
        <div className="hero__actions">
          <a href="#pricing" className="hero__btn hero__btn--primary">
            Начать
          </a>
          <a href="#changelog" className="hero__btn hero__btn--secondary">
            Подробнее
          </a>
        </div>
      </div>

      {/* Decorative orb */}
      <div className="hero__orb hero__orb--1"></div>
      <div className="hero__orb hero__orb--2"></div>
    </section>
  )
}

export default Hero