import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import MatrixBackground from './components/MatrixBackground'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import Pricing from './components/Pricing'
import Changelog from './components/Changelog'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('emissium-theme') || 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('emissium-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="app">
      <MatrixBackground />
      <Navbar theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content">
        <Hero />
        <Carousel />
        <Pricing />
        <Changelog />
      </main>
      <Footer />
    </div>
  )
}

export default App