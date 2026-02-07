import React, { useState } from "react";
import "../styles/Login.css"; // reuse your login CSS
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();


  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5050/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();
      setMessage(data.message);

      if (!data.success) {
  setIsError(true);
} else {
  setIsError(false);

  if (!data.success) {
  setIsError(true);
} else {
  setIsError(false);
  setMessage("If the email exists, a reset link has been sent. Check your inbox.");
}
}


    } catch (error) {
      console.error(error);
      setMessage("Server not reachable");
      setIsError(true);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2>Forgot Password</h2>
          <p>Enter your registered email to reset your password</p>
        </div>

        <form className="login-form" onSubmit={handleForgotPassword}>
          {/* Role selection */}
          <div className="form-group">
            <label>Your Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Placement Cell">Placement Cell</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Email input */}
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

          <button type="submit" className="sign-in-btn">
            Send Reset Link
          </button>
        </form>


        <div className="login-footer">
          <p>
            Remembered your password? <a href="/login">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
