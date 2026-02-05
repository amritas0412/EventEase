import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PlacementDashboard.css"; //  FIXED PATH
import { companies } from "../../data/companiesData";


const PlacementDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const upcomingDrives = 0;
  const pendingRequests = 0;
  const companiesVisited = companies.length;

  const handleLogout = () => {
    localStorage.removeItem("role"); 
    navigate("/login");
  };

  return (
    <div className="placement-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="brand">EventEase</h2>

        <ul>
          <li className="active">📊 Dashboard</li>
          <li
            onClick={() => navigate("/placement/placements")}
            style={{ cursor: "pointer" }}
          >
            📅 Placements
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Profile */}
        <div className="top-bar-profile">
          <div
            className="profile-icon"
            onClick={() => setShowProfile(!showProfile)}
          >
            👤
          </div>

          {showProfile && (
            <div className="profile-dropdown">
              <p className="profile-name">Placement Cell</p>
              <p className="profile-email">placementcell@banasthali.in</p>

              <p className="profile-stat">
                Total Placement Drives: <strong>—</strong>
              </p>

              <button className="profile-btn">📅 View Calendar</button>

              <button
                className="profile-btn logout"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <section className="stats">
          <div className="card">
            <h3>📅 Upcoming Drives</h3>
            <h2>{upcomingDrives}</h2>
            <p>Approved placement drives</p>
          </div>

          <div className="card">
            <h3>⏳ Pending Requests</h3>
            <h2>{pendingRequests}</h2>
            <p>Awaiting admin approval</p>
          </div>

          <div
  className="card clickable"
  onClick={() => navigate("/placement/companies")}
>
  <h3>🏢 Companies Visited</h3>
  <h2>{companiesVisited}</h2>
  <p>Total companies</p>
</div>

        </section>

        {/* History */}
        <section className="panel">
          <div className="panel-header">
            <h3>🕘 Placement History</h3>
          </div>

          <div className="panel-grid">
            <div className="event-card dashboard-card">
              <h4>Past Drive</h4>
              <p>Date</p>
              <p className="muted-text">Total Registrations: --</p>
              <p>Total Appeared Students</p>
              <p>Total Placed Students</p>
              <p>Feedback</p>
            </div>

            <div className="event-card dashboard-card empty-card">
              <p>Placement history will appear here</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PlacementDashboard;
