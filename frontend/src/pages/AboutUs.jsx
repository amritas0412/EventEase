import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AboutUs.css";

// Images
import banasthaliLogo from "../assets/banasthali_vidyapith_logo.jpeg";
import apajiDeptImage from "../assets/ApajiDept.jpeg";

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="about-layout">

        {/* LEFT SIDE CONTENT */}
        <div className="about-left">
          <img
            src={banasthaliLogo}
            alt="Banasthali Vidyapith Logo"
            className="about-logo"
          />

          <h1>About EventEase</h1>

          <p>
            <strong>EventEase</strong> is an integrated department management platform
            developed for <strong>Banasthali Vidyapith</strong> with the goal of
            simplifying event coordination and placement management.
          </p>

          <p>
            The platform allows students to explore and register for events and
            placement drives, faculty members to organize and manage activities,
            and the placement cell to publish opportunities seamlessly.
          </p>

          <p>
            By bringing all department activities under one system, EventEase
            enhances communication, transparency, and student engagement within
            the department.
          </p>

          <button
            className="about-signin-btn"
            onClick={() => navigate("/login")}
          >
            Sign In
          </button>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="about-right">
          <img
            src={apajiDeptImage}
            alt="Apaji Department Building"
            className="about-dept-image"
          />
        </div>

      </div>
    </div>
  );
};

export default AboutUs;