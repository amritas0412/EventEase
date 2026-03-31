import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useMemo } from "react";
import "../../styles/StudentDashboard.css";
import { Navigate } from "react-router-dom";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  // 🔵 FETCHED EVENTS
  const [events, setEvents] = useState([]);
  const [placements, setPlacements] = useState([]);
  const studentName = localStorage.getItem("name");
  const studentEmail = localStorage.getItem("email");
  const studentId = localStorage.getItem("studentId");
  const isLoggedIn = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!localStorage.getItem("role")) {
    return <Navigate to="/login" replace />;
  }

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

  useEffect(() => {
    fetch("http://localhost:5050/placement/all")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlacements(data.placements);
        }
      })
      .catch(err =>
        console.error("PLACEMENTS FETCH ERROR:", err)
      );
  }, []);
  useEffect(() => {
    const studentId = localStorage.getItem("studentId");

    if (!studentId) {
      console.log("No studentId found");
      return;
    }

    fetch(`http://localhost:5050/student/my-registrations/${studentId}`)
      .then(res => res.json())
      .then(data => {
        console.log("REG DATA:", data);
        console.log("STATE BEFORE:", registeredEvents); // 👈 add this
        if (data && data.success && Array.isArray(data.registrations)) {
          setRegisteredEvents(data.registrations);
        } else {
          setRegisteredEvents([]);
        }
      })
      .catch(err => {
        console.error("REG FETCH ERROR:", err);
        setRegisteredEvents([]);
      });
  }, []);
  const filteredEvents = registeredEvents.filter(reg =>
    reg.eventName?.toLowerCase().includes(search.toLowerCase())
  );

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const upcomingEvents = filteredEvents.filter(ev => {
    const d = new Date(ev.date);
    d.setHours(0, 0, 0, 0);
    return d >= todayDate;
  });

  const pastEvents = filteredEvents.filter(ev => {
    const d = new Date(ev.date);
    d.setHours(0, 0, 0, 0);
    return d < todayDate;
  });
  const todayEvents = events.filter(ev => {
    const d = new Date(ev.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime() === todayDate.getTime() &&
      ev.status === "approved" &&
      ev.conductedBy !== null;
  });
  const today = new Date().toISOString().split("T")[0];
  const upcomingAllEvents = events.filter(ev => {
    const d = new Date(ev.date);
    d.setHours(0, 0, 0, 0);
    return (
      d >= todayDate &&
      ev.status === "approved" &&
      ev.conductedBy !== null
    );
  });
  const upcomingPlacements = placements.filter(
    p => p.date >= today && p.status === "approved"
  );

  const todayPlacements = placements.filter(
    p => p.date === today && p.status === "approved"
  );

  const [registeredPlacements, setRegisteredPlacements] = useState([]);
  useEffect(() => {
    if (!studentId) return;
    fetch(`http://localhost:5050/student/my-placements/${studentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setRegisteredPlacements(data.placements);
        }
      })
      .catch(err => console.error("MY PLACEMENTS ERROR:", err));
  }, [studentId]);
  const filteredPlacements = registeredPlacements
    .map(reg => reg.placementId)
    .filter(Boolean)
    .filter(p => p.date && p.date >= today)
    .filter(p =>
      `${p.name || ""} ${p.jobrole || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  useEffect(() => {
    const handleBack = () => {
      navigate("/login", { replace: true });
    };
  
    window.onpopstate = handleBack;
  
    return () => {
      window.onpopstate = null;
    };
  }, []);

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
                    localStorage.clear();
                    navigate("/login", { replace: true });
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
            {upcomingAllEvents.length}
          </div>
          <div className="card-subtext">
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-title">
            Placements
          </div>
          <div className="card-number">{upcomingPlacements.length}</div>
          <div className="card-subtext">
          </div>
        </div>
      </div>

      {/* ================= TODAY SECTION ================= */}
      <div className="dashboard-section">
        <h3>📅 Today</h3>

        {todayEvents.length === 0 && todayPlacements.length === 0 ? (
          <p>No activities today</p>
        ) : (
          <>
            {/* Events */}
            {todayEvents.map(ev => (
              <div
                key={ev._id}
                className="today-event"
              >
                <span>{ev.eventName}</span>
                <span>
                  {ev.startTime} – {ev.endTime}
                </span>
              </div>
            ))}

            {/* Placements */}
            {todayPlacements.map(p => (
              <div key={p._id} className="today-event">
                <span>💼 {p.name}</span>
                <span className="event-time">
                  ⏰ {p.time} – {p.endtime}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* ================= MY REGISTRATIONS ================= */}
      <div className="dashboard-section">
        <h3>📝 My Registrations</h3>
        <div className="registrations-grid">
          {/* EVENTS */}
          <div>
            <h4>Registered Events</h4>

            {/* Upcoming */}
            <div className="registration-block">
              <h5>📅 Upcoming</h5>

              {upcomingEvents.length === 0 ? (
                <p className="empty-text">No upcoming events</p>
              ) : (
                upcomingEvents.map((reg) => (
                  <div key={reg._id} className="registration-card upcoming">
                    <strong>{reg.eventName}</strong>
                    <p>📅 {reg.date}</p>
                  </div>
                ))
              )}
            </div>

            {/* Past */}
            <div className="registration-block">
              <h5>🕘 Past</h5>

              {pastEvents.length === 0 ? (
                <p className="empty-text">No past events</p>
              ) : (
                pastEvents.map((reg) => (
                  <div key={reg._id} className="registration-card past">
                    <strong>{reg.eventName}</strong>
                    <p>📅 {reg.date}</p>
                  </div>
                ))
              )}
            </div>
          </div>
          {/* PLACEMENTS */}
          <div>
            <h4>Registered Placements</h4>
            {filteredPlacements.length === 0 ? (
              <p className="empty-text">
                {registeredPlacements.length === 0
                  ? "You have not registered in any placement"
                  : "No matching placements"}
              </p>
            ) : (
              <ul>
                {filteredPlacements.map(
                  (place, index) => (
                    <li key={index}>
                      {place?.name} – {place?.jobrole}
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

