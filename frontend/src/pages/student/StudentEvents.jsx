import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/StudentEvents.css";

const StudentEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [registeredEventIds, setRegisteredEventIds] = useState([]);
  const [showProfile, setShowProfile] = useState(false); // ✅ added

  const studentId = localStorage.getItem("studentId");
  const studentName = localStorage.getItem("name");
  const studentEmail = localStorage.getItem("email");

  useEffect(() => {
    // Fetch events
    fetch("http://localhost:5050/faculty/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const filtered = data.events.filter(
            event =>
              event.conductedBy !== null &&
              event.status === "approved"
          );
          setEvents(filtered);
        }
      });

    // Fetch student registrations
    fetch(`http://localhost:5050/student/my-registrations/${studentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const ids = data.registrations.map(reg => reg.eventId);
          setRegisteredEventIds(ids);
        }
      });

  }, [studentId]);

  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter(e => e.date >= today);
  const pastEvents = events.filter(e => e.date < today);

  return (
    <div className="student-events-page">

      {/* ================= TOP BAR (ADDED) ================= */}
      <div className="top-bar-profile">
        <div
          className="profile-icon"
          onClick={() => setShowProfile(!showProfile)}
        >
          👤
        </div>

        {showProfile && (
          <div className="profile-dropdown">
            <p
              className="profile-name clickable"
              onClick={() => navigate("/student/profile")}
            >
              {studentName || "Student"}
            </p>

            <p className="profile-email">{studentEmail}</p>

            <button
              className="profile-btn"
              onClick={() => navigate("/student/calendar")}
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

      {/* ================= UPCOMING EVENTS ================= */}
      <h2 className="events-title">Upcoming Events</h2>
      <div className="events-list">
        {upcomingEvents.map(event => {
          const isRegistered = registeredEventIds.includes(event._id);

          return (
            <div className="event-card" key={event._id}>
              <h3>{event.eventName}</h3>
              <p>Date: {event.date}</p>
              <p>Location: {event.venue}</p>

              {isRegistered ? (
                <>
                  <p className="status-registered">Status: Registered</p>
                  <button className="registered-btn" disabled>
                    Registered
                  </button>
                </>
              ) : (
                <button
                  className="event-btn"
                  onClick={() =>
                    navigate(`/student/events/${event._id}`)
                  }
                >
                  Register
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* ================= PAST EVENTS ================= */}
      <h2 className="events-title">
        Completed Events
      </h2>

      <div className="events-list">
        {pastEvents.length === 0 ? (
          <p>No completed events yet.</p>
        ) : (
          pastEvents.map(event => {
            const isRegistered = registeredEventIds.includes(event._id);

            return (
              <div className="event-card past-event-card" key={event._id}>
                <h3>{event.eventName}</h3>
                <p>Date: {event.date}</p>
                <p>Location: {event.venue}</p>

                {isRegistered ? (
                  <button
                    className="feedback-btn"
                    onClick={() =>
                      navigate(`/student/events/${event._id}/feedback`)
                    }
                  >
                    Give Feedback
                  </button>
                ) : (
                  <p className="not-registered-text">
                    You did not attend this event
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentEvents;