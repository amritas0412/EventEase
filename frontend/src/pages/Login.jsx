import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(''); // store backend response
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault(); // stop page reload

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }) // send user input
      });

      const data = await response.json();
      console.log(data);

      setMessage(data.message); // show backend message on page

      if (!data.success) {
        setIsError(true);
      } else {
        setIsError(false);
      }

      if (data.success) {
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
      navigate("/placement/dashboard");
      break;

    default:
      navigate("/");
  }

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);

    navigate("/student/dashboard");
  } else {
    alert(data.message);
  }
}


    } catch (error) {
      console.error("Error:", error);
      setMessage("Cannot connect to server");
      setIsError(true);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">E</div>
          <h1>EventEase</h1>
          <p>Your Department Event Hub. Sign in to continue.</p>
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
            <input
              type="email"
              placeholder="name@example.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
  <label>Password</label>
  <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <a href="/forgot-password" className="forgot-password">Forgot your password?</a>
</div>


{message && (
    <p
      style={{
        color: isError ? "red" : "green",
        textAlign: "center",
        margin: "10px 0"
      }}
    >
      {message}
    </p>
  )}

          <button type="submit" className="sign-in-btn">Sign In</button>
        </form>

        {/* Show backend message here */}
        {/*message && <p className="login-message">{message}</p>*/}

        <div className="login-footer">
          
          <p className="admin-note">
            For admin/faculty/placement-cell accounts, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;