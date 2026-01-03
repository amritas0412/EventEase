import React from "react";
import "./Welcome.css";

const Welcome = () => {
  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">📘</span>
          <span className="logo-text">EventEase</span>
        </div>

        <div className="nav-actions">
          <button className="btn-link">Sign In</button>
          <button className="btn-primary">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Excellence for All, Excellence <br /> from All
          </h1>
          <p>
            EventEase helps you discover events, manage clubs, and find
            placement opportunities, all in one place.
          </p>

          <button className="btn-primary hero-btn">
            Explore Events
          </button>
        </div>

        <div className="hero-right">
          <img
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1"
            alt="Event"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        © 2025 EventEase. All rights reserved.
      </footer>
    </>
  );
};

export default Welcome;
