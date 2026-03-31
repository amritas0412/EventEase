import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/AdminEventDetails.css";

const AdminEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5050/admin/events/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvent(data.event);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("FETCH DETAILS ERROR:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;

  if (!event) return <p style={{ padding: "40px" }}>Event not found.</p>;

  return (
    <div className="admin-event-details-page">

      {/* HEADER */}
      <div className="details-header">
        <h2>{event.eventName}</h2>

        <button 
          className="back-btn" 
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      {/* DETAILS CARD */}
      <div className="details-card">
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Eligible:</strong> {event.eligible}</p>

        {/* DESCRIPTION */}
        <div className="description-box">
          <strong>Description:</strong>
          <p className="description-text">
            {event.description}
          </p>
        </div>

        <p><strong>Status:</strong> {event.status}</p>
      </div>

    </div>
  );
};

export default AdminEventDetails;
