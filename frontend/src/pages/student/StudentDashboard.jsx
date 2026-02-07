import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/StudentDashboard.css";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  // 🔵 FETCHED EVENTS
  const [events, setEvents] = useState([]);
  const studentName = localStorage.getItem("name");
  const studentEmail = localStorage.getItem("email");

  useEffect(() => {
    fetch("http://localhost:5050/faculty/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events);
        }
      })
      .catch(err =>
        console.error("STUDENT DASHBOARD FETCH ERROR:", err)
      );
  }, []);

  // 📅 DATE LOGIC
  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter(ev => ev.date >= today);

  const todayEvents = upcomingEvents.filter(ev => ev.date === today);

  /* ---------------- STILL DUMMY (for now) ---------------- */
  const registeredEvents = ["Tech Fest 2026", "Cultural Night"];

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
          <div className="profile-wrapper">
            <div
              className="profile-avatar"
              onClick={() => setShowProfile(!showProfile)}
            >
              👤
            </div>

            {showProfile && (
              <div className="profile-dropdown">
                
                {/* <p className="profile-name clickable">
                  {studentName || "Student"}
                </p> */}
                <p
  className="profile-name clickable"
  onClick={() => navigate("/student/profile")}
>
  {studentName || "Student"}
</p>


                <p className="profile-email">
                  {studentEmail}
                </p>
                <button
                  className="profile-btn"
                  onClick={() =>
                    navigate("/student/calendar")
                  }
                >
                  📅 View Calendar
                </button>

                <button
                  className="profile-btn logout"
                  onClick={() => {
                    localStorage.removeItem("role");
                    navigate("/login");
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= DASHBOARD CARDS ================= */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <div className="card-title">
            Upcoming Events
          </div>
          <div className="card-number">
            {upcomingEvents.length}
          </div>
          <div className="card-subtext">
            Approved by admin
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">
            Placements
          </div>
          <div className="card-number">18</div>
          <div className="card-subtext">
            +3 new drives this month
          </div>
        </div>
      </div>

      {/* ================= TODAY SECTION ================= */}
      <div className="dashboard-section">
        <h3>📅 Today</h3>

        {todayEvents.length === 0 ? (
          <p>No events today</p>
        ) : (
          todayEvents.map(ev => (
            <div
              key={ev._id}
              className="today-event"
            >
              <span>{ev.eventName}</span>
              <span>
                {ev.startTime} – {ev.endTime}
              </span>
            </div>
          ))
        )}
      </div>

      {/* ================= MY REGISTRATIONS ================= */}
      <div className="dashboard-section">
        <h3>📝 My Registrations</h3>

        <div className="registrations-grid">
          {/* EVENTS */}
          <div>
            <h4>Registered Events</h4>
            {filteredEvents.length === 0 ? (
              <p className="empty-text">
                No matching events
              </p>
            ) : (
              <ul>
                {filteredEvents.map(
                  (event, index) => (
                    <li key={index}>
                      {event}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>

          {/* PLACEMENTS */}
          <div>
            <h4>Registered Placements</h4>
            {filteredPlacements.length === 0 ? (
              <p className="empty-text">
                No matching placements
              </p>
            ) : (
              <ul>
                {filteredPlacements.map(
                  (place, index) => (
                    <li key={index}>
                      {place}
                    </li>
                  )
                )}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
