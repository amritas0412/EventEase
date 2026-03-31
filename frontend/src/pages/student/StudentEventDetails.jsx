import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/StudentEventDetails.css";

const StudentEventDetails = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);

  const studentId = localStorage.getItem("studentId");
  const formatDescription = (text = "") => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(urlRegex).map((part, j) =>
          urlRegex.test(part) ? (
            <a key={j} href={part} target="_blank" rel="noopener noreferrer">
              {part}
            </a>
          ) : (
            part
          )
        )}
        <br />
      </span>
    ));
  };
  // ✅ Fetch event by ID
  useEffect(() => {
    fetch(`http://localhost:5050/student/events/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvent(data.event);
        }
      })
      .catch(err => console.error("DETAIL FETCH ERROR:", err));
  }, [id]);

  // ✅ Check registration status
  useEffect(() => {
    if (!event) return;

    fetch(
      `http://localhost:5050/student/registration/check?studentId=${studentId}&eventId=${event._id}`
    )
      .then(res => res.json())
      .then(data => {
        if (data.registered) {
          setRegistered(true);
        }
      })
      .catch(err => console.error("CHECK REG ERROR:", err));
  }, [event, studentId]);

  if (!event) {
    return <p className="loading-text">Loading event...</p>;
  }

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5050/student/register/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          eventId: event._id
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Registered Successfully");
        setRegistered(true);
      } else {
        alert(data.message || "Something went wrong");
      }

    } catch (err) {
      console.error("REGISTER ERROR:", err);
    }
  };

  return (
    <div className="event-details-page">
      <h2 className="event-title">{event.eventName}</h2>

      <div className="event-details-card">
        {/* <p><strong>Description:</strong> {event.description}</p> */}
        <p>
          <strong>Description:</strong><br />
          <span className="description-text">
            {formatDescription(event.description)}
          </span>
        </p>
        <p><strong>Organizer:</strong> {event.conductedBy?.name || "Unknown"}</p>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
        <p><strong>Location:</strong> {event.venue}</p>

        <p>
          <strong>Status:</strong>{" "}
          {registered ? "Registered" : "Not Registered"}
        </p>

        <button
          className={registered ? "registered-btn" : "register-btn"}
          onClick={handleRegister}
          disabled={registered}
        >
          {registered ? "Registered" : "Register"}
        </button>
      </div>
    </div>
  );
};

export default StudentEventDetails;
