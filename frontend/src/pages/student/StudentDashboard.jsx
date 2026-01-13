import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  /* ---------------- DUMMY DATA ---------------- */
  const todayEvent = {
    title: "Tech Talk on AI",
    time: "2:00 PM",
  };

  const registeredEvents = [
    "Tech Fest 2026",
    "Cultural Night",
  ];

  const registeredPlacements = [
    "Google – Software Engineer",
    "Amazon – Data Analyst",
  ];

  /* ---------------- SEARCH LOGIC ---------------- */
  const filteredEvents = registeredEvents.filter(event =>
    event.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPlacements = registeredPlacements.filter(place =>
    place.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-page">

      {/* ================= TOP BAR ================= */}
      <div className="dashboard-topbar">
        <input
          type="text"
          placeholder="Search events, placements..."
          className="dashboard-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="topbar-actions">
          <button
            className="sync-btn"
            onClick={() => navigate("/student/calendar")}
          >
            View Calendar
          </button>

          <button
            className="logout-btn"
            onClick={() => navigate("/login")}
          >
            Logout
          </button>

          {/* Profile Avatar */}
          <div
            className="profile-avatar"
            onClick={() => navigate("/student/profile")}
          >
            RB
          </div>
        </div>
      </div>

      {/* ================= DASHBOARD CARDS ================= */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-title">Upcoming Events</div>
          <div className="card-number">24</div>
          <div className="card-subtext">+5 since last week</div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">Placements</div>
          <div className="card-number">18</div>
          <div className="card-subtext">+3 new drives this month</div>
        </div>
      </div>

      {/* ================= TODAY SECTION ================= */}
      <div className="dashboard-section">
        <h3>📅 Today – Fri Jan 09 2026</h3>

        <div className="today-event">
          <span>{todayEvent.title}</span>
          <span>{todayEvent.time}</span>
        </div>
      </div>

      {/* ================= MY REGISTRATIONS ================= */}
      <div className="dashboard-section">
        <h3>📝 My Registrations</h3>

        <div className="registrations-grid">
          {/* EVENTS */}
          <div>
            <h4>Registered Events</h4>
            {filteredEvents.length === 0 ? (
              <p className="empty-text">No matching events</p>
            ) : (
              <ul>
                {filteredEvents.map((event, index) => (
                  <li key={index}>{event}</li>
                ))}
              </ul>
            )}
          </div>

          {/* PLACEMENTS */}
          <div>
            <h4>Registered Placements</h4>
            {filteredPlacements.length === 0 ? (
              <p className="empty-text">No matching placements</p>
            ) : (
              <ul>
                {filteredPlacements.map((place, index) => (
                  <li key={index}>{place}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
