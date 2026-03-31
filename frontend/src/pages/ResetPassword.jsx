import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";

const ResetPassword = () => {
  const { token } = useParams(); // get token from URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState(""); // Student / Faculty / Admin / Placement Cell
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!role) {
      setError("Please select your role");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5050/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, role }),
        }
      );
      const data = await res.json();

      if (data.success) {
        setMessage("Password reset successful. You can close this tab and login again.");
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div className="reset-page">
      <div className="reset-card">
        <h2>Reset Password</h2>

        {message && <p className="success-msg">{message}</p>}
        {error && <p className="error-msg">{error}</p>}

        {!message && (
          <form className="reset-form" onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <select value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="Placement Cell">Placement Cell</option>
              <option value="Admin">Admin</option>
            </select>

            <button className="reset-btn" type="submit">
              Reset Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;