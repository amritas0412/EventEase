import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("Student");

  const handleLogin = (e) => {
    e.preventDefault();

    // ROLE-BASED REDIRECT
    if (role === "Student") {
      navigate("/student/dashboard");
    } else if (role === "Admin") {
      navigate("/admin/dashboard"); // ✅ FIXED
    } else if (role === "Faculty") {
      alert("Faculty dashboard coming soon");
    } else if (role === "Placement Cell") {
      alert("Placement Cell dashboard coming soon");
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
            For admin/faculty/placement-cell accounts, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
