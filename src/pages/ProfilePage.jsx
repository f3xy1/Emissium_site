import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MatrixBackground from '../components/MatrixBackground'
import BackgroundOrbs from '../components/BackgroundOrbs'
import ProfileCard from '../components/ProfileCard'
import './ProfilePage.css'

function ProfilePage() {
  return (
    <div className="profile-page">
      <MatrixBackground />
      <BackgroundOrbs />
      <Navbar />
      <main className="profile-page__main">
        <ProfileCard />
      </main>
      <Footer />
    </div>
  )
}

export default ProfilePage