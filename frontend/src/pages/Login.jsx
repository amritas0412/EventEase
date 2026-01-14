import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔐 Store role for protected routes
    switch (role) {
      case "Student":
        localStorage.setItem("role", "student");
        navigate("/student/dashboard");
        break;

      case "Admin":
        localStorage.setItem("role", "admin");
        navigate("/admin/dashboard");
        break;

      case "Faculty":
        localStorage.setItem("role", "faculty");
        navigate("/faculty/dashboard");
        break;

      case "Placement Cell":
        localStorage.setItem("role", "placement");
        navigate("/placement/dashboard"); // ✅ FIXED
        break;

      default:
        navigate("/");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">E</div>
          <h1>EventEase</h1>
          <p>Your Campus Event Hub. Sign in to continue.</p>
        </div>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Your Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
              <option value="Faculty">Faculty</option>
              <option value="Placement Cell">Placement Cell</option>
            </select>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" required />
          </div>

          <button type="submit" className="sign-in-btn">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p>
            Don't have an account? <a href="#">Sign Up</a>
          </p>
          <p className="admin-note">
            For admin, faculty, or placement accounts, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
