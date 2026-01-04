import React, { useState } from 'react';
import '../styles/Login.css';

const Login = () => {
  const [role, setRole] = useState('Student');

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">E</div>
          <h1>EventEase</h1>
          <p>Your Campus Event Hub. Sign in to continue.</p>
        </div>

        <form className="login-form">
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
            <input type="email" placeholder="name@example.edu" required />
          </div>

          <div className="form-group">
            <div className="label-row">
              <label>Password</label>
              <a href="#" className="forgot-password">Forgot your password?</a>
            </div>
            <input type="password" required />
          </div>

          <button type="submit" className="sign-in-btn">Sign In</button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <a href="#">Sign Up</a></p>
          <p className="admin-note">
            For admin/faculty/placement-cell accounts, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;