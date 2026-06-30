import React from 'react'
import './BackgroundOrbs.css'

function BackgroundOrbs() {
  return (
    <div className="bg-orbs">
      {/* Hero — правый, опущен ниже навбара */}
      <div className="bg-orb bg-orb--hero-right"></div>

      {/* Hero — левый нижний, переход к карусели */}
      <div className="bg-orb bg-orb--hero-left"></div>

      {/* Карусель — правый */}
      <div className="bg-orb bg-orb--carousel-right"></div>

      {/* Pricing — левый */}
      <div className="bg-orb bg-orb--pricing-left"></div>

      {/* Changelog — правый */}
      <div className="bg-orb bg-orb--changelog-right"></div>
    </div>
  )
}

export default BackgroundOrbs