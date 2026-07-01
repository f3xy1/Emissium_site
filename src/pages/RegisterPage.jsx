import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MatrixBackground from '../components/MatrixBackground'
import BackgroundOrbs from '../components/BackgroundOrbs'
import RegisterForm from '../components/RegisterForm'
import './LoginPage.css' // те же базовые стили страницы

function RegisterPage() {
  return (
    <div className="login-page">
      <MatrixBackground />
      <BackgroundOrbs />
      <Navbar />
      <main className="login-page__main">
        <RegisterForm />
      </main>
      <Footer />
    </div>
  )
}

export default RegisterPage