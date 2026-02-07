import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ExploreEvents.css";

const ExploreEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  // 🔥 FETCH APPROVED EVENTS
  useEffect(() => {
    fetch("http://localhost:5050/faculty/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events);
        }
      })
      .catch(err => console.error("EXPLORE FETCH ERROR:", err));
  }, []);

  const today = new Date().toISOString().split("T")[0];

  // UPCOMING
  const upcomingEvents = events.filter(
    e =>
      e.date >= today &&
      e.eventName.toLowerCase().includes(search.toLowerCase())
  );

  // PAST
  const pastEvents = events.filter(
    e =>
      e.date < today &&
      e.eventName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="explore-container">
      <h1>Explore Events</h1>
      <p className="subtitle">Discover events at Banasthali Vidyapith</p>

      <input
        type="text"
        placeholder="Search events..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* ===== TWO COLUMN LAYOUT ===== */}
      <div className="events-layout">

        {/* LEFT → UPCOMING */}
        <div className="events-column">
          <h2 className="section-title">Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <p className="no-events">No upcoming events.</p>
          ) : (
            upcomingEvents.map(event => (
              <div className="event-card" key={event._id}>
                <span className="category">Approved</span>
                <h3>{event.eventName}</h3>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p className="desc">{event.description}</p>

                <button
                  className="register-btn"
                  onClick={() => {
                    if (!isLoggedIn) {
                      alert("Please login first to register");
                      navigate("/login");
                    } else {
                      navigate("/student/events");
                    }
                  }}
                >
                  Register Now
                </button>
              </div>
            ))
          )}
        </div>

        {/* RIGHT → PAST */}
        <div className="events-column">
          <h2 className="section-title past-title">Past Events</h2>

          {pastEvents.length === 0 ? (
            <p className="no-events">No past events.</p>
          ) : (
            pastEvents.map(event => (
              <div className="event-card past-event" key={event._id}>
                <span className="category past-badge">Completed</span>
                <h3>{event.eventName}</h3>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p className="desc">{event.description}</p>

                <button className="completed-btn" disabled>
                  Event Completed
                </button>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default ExploreEvents;
