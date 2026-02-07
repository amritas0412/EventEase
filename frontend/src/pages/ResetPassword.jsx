import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams(); // get token from URL
  //const navigate = useNavigate();

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
      const res = await fetch(`http://localhost:5050/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, role }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Password reset successful. You can close this tab and login again.");
        //setTimeout(() => navigate("/login"), 2000); // redirect after 2 sec
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Try again later.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>Reset Password</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Hide form after success */}
      {!message && (
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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

        <button type="submit">Reset Password</button>
      </form>
      )}
    </div>
  );
};

export default ResetPassword;
