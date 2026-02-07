import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/StudentEvents.css";

const StudentEvents = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);

  // 🔥 Fetch approved events from DB
  useEffect(() => {
    fetch("http://localhost:5050/faculty/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events);
        }
      })
      .catch(err => console.error("STUDENT FETCH ERROR:", err));
  }, []);

  return (
    <div>
      <h2 className="events-title">Events</h2>

      <div className="events-list">
        {events.length === 0 ? (
          <p>No approved events yet.</p>
        ) : (
          events.map(event => (
            <div className="event-card" key={event._id}>
              <h3>{event.eventName}</h3>
              <p>Date: {event.date}</p>
              <p>Location: {event.venue}</p>

              <button
                className="event-btn"
                onClick={() =>
                  navigate(`/student/events/${event._id}`)
                }
              >
                View Details
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentEvents;
