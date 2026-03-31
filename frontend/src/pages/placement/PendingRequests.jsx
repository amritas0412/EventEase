import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Placements.css";

const PendingRequests = () => {
  const navigate = useNavigate();
  const [pending, setPending] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/placement/all")
      .then(res => res.json())
      .then(data => {
        const placements = data.placements || [];
        const onlyPending = placements.filter(p => p.status === "pending");
        setPending(onlyPending);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="placement-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">E</div>
          <span className="logo-text">EventEase</span>
        </div>
        <ul>
          <li onClick={() => navigate("/placement/dashboard")}>
            📊 Dashboard
          </li>
          <li className="active">⏳ Pending Requests</li>
        </ul>
      </aside>

      {/* Main */}
      <main className="main-content">
        <h2>⏳ Pending Placement Requests</h2>

        <div className="panel-grid">
          {pending.length > 0 ? (
            pending.map(req => (
              <div key={req._id} className="event-card pending">
                <h4>{req.name}</h4>
                <p>💼 {req.jobrole}</p>
                <p>
                  📅 {new Date(req.date).toLocaleDateString("en-GB")}
                </p>
                <p>🏢 {req.venue}</p>
                <p>🎓 {req.audience}</p>
              </div>
            ))
          ) : (
            <div className="event-card empty-card">
              <p>No pending requests 🎉</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PendingRequests;