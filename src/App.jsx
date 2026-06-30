import React from 'react'
import Navbar from './components/Navbar'
import MatrixBackground from './components/MatrixBackground'
import BackgroundOrbs from './components/BackgroundOrbs'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import Pricing from './components/Pricing'
import Changelog from './components/Changelog'
import Footer from './components/Footer'
import './App.css'

function App() {
  return (
    <div className="app">
      <MatrixBackground />
      <BackgroundOrbs />
      <Navbar />
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