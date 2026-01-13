
import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Welcome.css'

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <div className="welcome-container">
      
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">E</span> EventEase
        </div>

        <div className="nav-links">
          <button 
            className="sign-in"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>

          <button className="get-started">
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="hero">
        <div className="hero-content">
          <h1>Excellence for All, Excellence from All</h1>
          <p>
            EventEase helps you discover events, manage clubs, and find 
            placement opportunities, all in one place.
          </p>
          <button className="explore-btn">Explore Events</button>
        </div>
        
        <div className="hero-image">
          <img 
            src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800" 
            alt="Event Hall"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 EventEase. All rights reserved.</p>
        <div className="footer-links">
          <span>Terms of Service</span>
          <span>Privacy</span>
        </div>
      </footer>

    </div>
  )
}

export default Welcome
