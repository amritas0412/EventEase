import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5050/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
      console.log("FULL LOGIN DATA:", data);

      if (!data.success || !data.user) {
        setIsError(true);
        setMessage(data.message || "Login failed");
        return;
      }

      const backendRole = (data.role || role).toLowerCase();

      localStorage.clear();

      localStorage.setItem("role", backendRole);
      localStorage.setItem("email", data.user.email || "");
      localStorage.setItem("name", data.user.name || "");

      if (backendRole === "student") {
        localStorage.setItem("studentId", data.user._id);
      }

      if (backendRole === "faculty") {
        localStorage.setItem("facultyId", data.user._id || "");
      }

      if (backendRole === "student")
        navigate("/student/dashboard", { replace: true });

      else if (backendRole === "admin")
        navigate("/admin/dashboard", { replace: true });

      else if (backendRole === "faculty")
        navigate("/faculty/dashboard", { replace: true });

      else if (backendRole.includes("placement"))
        navigate("/placement/dashboard", { replace: true });

      setIsError(false);
      setMessage("Login successful");

    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setMessage("Login failed — check credentials");
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
            <select
              className="form-input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
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
              className="form-input"
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
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="/forgot-password" className="forgot-password">
              Forgot your password?
            </a>
          </div>

          {message && (
            <p
              style={{
                color: isError ? "red" : "green",
                textAlign: "center",
                margin: "10px 0",
              }}
            >
              {message}
            </p>
          )}

          <button type="submit" className="sign-in-btn">
            Sign In
          </button>
        </form>

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
