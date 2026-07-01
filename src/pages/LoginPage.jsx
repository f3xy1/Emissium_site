import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MatrixBackground from '../components/MatrixBackground'
import BackgroundOrbs from '../components/BackgroundOrbs'
import LoginForm from '../components/LoginForm'
import './LoginPage.css'

function LoginPage() {
  return (
    <div className="login-page">
      <MatrixBackground />
      <BackgroundOrbs />
      <Navbar />
      <main className="login-page__main">
        <LoginForm />
      </main>
      <Footer />
    </div>
  )
}

export default LoginPage