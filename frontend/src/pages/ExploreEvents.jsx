import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ExploreEvents.css";

// Dummy Events Data
const eventsData = [
  {
    id: 1,
    title: "Tech Fest 2026",
    date: "2026-03-15",
    venue: "Main Auditorium",
    category: "Technical",
    description: "A national-level technical festival."
  },
  {
    id: 2,
    title: "Cultural Night",
    date: "2026-04-10",
    venue: "Open Ground",
    category: "Cultural",
    description: "Celebrating diversity through performances."
  },
  {
    id: 3,
    title: "Workshop on AI",
    date: "2025-01-05",
    venue: "Seminar Hall",
    category: "Workshop",
    description: "Hands-on AI workshop."
  }
];

const ExploreEvents = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const isLoggedIn = !!localStorage.getItem("token");

  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = eventsData.filter(
    e => e.date >= today && e.title.toLowerCase().includes(search.toLowerCase())
  );

  const pastEvents = eventsData.filter(
    e => e.date < today && e.title.toLowerCase().includes(search.toLowerCase())
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

        {/* LEFT → UPCOMING EVENTS */}
        <div className="events-column">
          <h2 className="section-title">Upcoming Events</h2>

          {upcomingEvents.length === 0 ? (
            <p className="no-events">No upcoming events.</p>
          ) : (
            upcomingEvents.map(event => (
              <div className="event-card" key={event.id}>
                <span className="category">{event.category}</span>
                <h3>{event.title}</h3>
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

        {/* RIGHT → PAST EVENTS */}
        <div className="events-column">
          <h2 className="section-title past-title">Past Events</h2>

          {pastEvents.length === 0 ? (
            <p className="no-events">No past events.</p>
          ) : (
            pastEvents.map(event => (
              <div className="event-card past-event" key={event.id}>
                <span className="category past-badge">Completed</span>
                <h3>{event.title}</h3>
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