import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FacultyDashboard.css"; // ✅ FIXED PATH
import FacultyProfile from "./FacultyProfile";

const FacultyDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const facultyId = localStorage.getItem("facultyId");

  useEffect(() => {
    fetch("http://localhost:5050/faculty/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events);

          // ✅ ADD THESE TWO LINES
          console.log("Logged Email:", localStorage.getItem("email"));
          console.log("Events:", data.events);
        }
      })
      .catch(err => console.error("FETCH ERROR:", err));
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const loggedInEmail = localStorage.getItem("email");

  const upcomingEvents = events
    .filter(ev => ev.status === "approved")
    .filter(ev => ev.date >= today)
    .filter(ev =>
      ev.eventName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const pendingEvents = events
    .filter(ev => ev.conductedBy?._id === facultyId)
    .filter(ev => ev.status === "pending");

  // Past = finished events
  const pastEvents = events.filter(ev =>
    new Date(ev.date) < new Date() &&
    ev.conductedBy?._id === facultyId
  );

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="faculty-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="brand">EventEase</h2>
        <ul>
          <li className="active">📊 Dashboard</li>
          <li
            onClick={() => navigate("/faculty/events")}
            style={{ cursor: "pointer" }}
          >
            📅 Events
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

              <FacultyProfile events={pastEvents} />

              <button
                className="profile-btn"
                onClick={() => navigate("/faculty/calendar")}
              >
                📅 View Calendar
              </button>

              <button
                className="profile-btn logout"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>

            </div>
          )}
        </div>

        {/* Department Events */}
        <section className="panel">
          <div className="panel-header">
            <h3>🏫 Department Events</h3>
            <input
              type="text"
              className="search-input"
              placeholder="Search Events"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}

            />

          </div>

          <div className="panel-grid">
            {upcomingEvents.length === 0 ? (
              <div className="event-card dashboard-card empty-card">
                <p>No department events yet</p>
              </div>
            ) : (
              upcomingEvents.map(ev => (
                <div key={ev._id} className="event-card dashboard-card">
                  <h4>{ev.eventName}</h4>
                  <p>📅 {ev.date}</p>
                  <p>⏰ {ev.startTime} - {ev.endTime}</p>
                  <p>📍 {ev.venue}</p>
                  {/* <p>Conducted by {ev.conductedBy?.name}</p>
                  <button
                    className="profile-btn"
                    onClick={() => navigate(`/faculty/event/${ev._id}/students`)}
                  >
                    View Registered Students
                  </button> */}
                  <p>Conducted by {ev.conductedBy?.name}</p>

                  {ev.conductedBy?._id === facultyId && (
                    <>
                      {/* <p className="muted-text">
                        Registered: {ev.registeredStudents?.length || 0}
                      </p> */}
                      <p className="muted-text">
  Registered: {ev.registeredCount || 0}
</p>
                      <button
                        className="profile-btn"
                        onClick={() => navigate(`/faculty/event/${ev._id}/students`)}
                      >
                        View Registered Students
                      </button>
                    </>
                  )}

                </div>
              ))
            )}
          </div>
        </section>
        {/* Pending Requests */}
        <section className="panel">
          <div className="panel-header">
            <h3>⏳ Request Processing</h3>
          </div>

          <div className="panel-grid">
            {pendingEvents.length === 0 ? (
              <div className="event-card dashboard-card empty-card">
                <p>No pending requests</p>
              </div>
            ) : (
              pendingEvents.map(ev => (
                <div key={ev._id} className="event-card dashboard-card pending-card">
                  <h4>{ev.eventName}</h4>
                  <p>📅 {ev.date}</p>
                  <p className="status-text">Status: Pending Approval</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Faculty Event History */}
        <section className="panel">
          <div className="panel-header">
            <h3>🕘 Your Event History</h3>
          </div>
          <div className="panel-grid">
            {pastEvents.length === 0 ? (
              <div className="event-card dashboard-card empty-card">
                <p>Your conducted events will appear here</p>
              </div>
            ) : (
              pastEvents.map(ev => (
                <div key={ev._id} className="event-card dashboard-card">
                  <h4>{ev.eventName}</h4>
                  <p>📅 {ev.date}</p>
                  <p>Feedback: --</p>
                  <p className="muted-text">
                    Total Registrations: {ev.registeredStudents?.length || 0}
                  </p>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default FacultyDashboard;
