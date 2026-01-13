import { useNavigate } from "react-router-dom";
import "../../styles/StudentEvents.css";

const StudentEvents = () => {
  const navigate = useNavigate();

  // ✅ EVENTS DATA
  const events = [
    {
      id: 1,
      title: "Tech Fest 2026",
      date: "12 Feb 2026",
      location: "Main Auditorium",
    },
    {
      id: 2,
      title: "Cultural Night",
      date: "20 Feb 2026",
      location: "Open Ground",
    },
    {
      id: 3,
      title: "Placement Drive",
      date: "5 Mar 2026",
      location: "Seminar Hall",
    },
  ];

  return (
    <div>
      <h2 className="events-title"> Events</h2>

      <div className="events-list">
        {events.map((event) => (
          <div className="event-card" key={event.id}>
            <h3>{event.title}</h3>
            <p>Date: {event.date}</p>
            <p>Location: {event.location}</p>

            <button
              className="event-btn"
              onClick={() =>
                navigate(`/student/events/${event.id}`)
              }
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentEvents;
