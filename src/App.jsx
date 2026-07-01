import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MatrixBackground from './components/MatrixBackground'
import BackgroundOrbs from './components/BackgroundOrbs'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Carousel from './components/Carousel'
import Pricing from './components/Pricing'
import Changelog from './components/Changelog'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import './App.css'

function HomePage() {
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App