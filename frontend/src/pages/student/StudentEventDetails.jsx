import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/StudentEventDetails.css";

const StudentEventDetails = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);

  // ⭐ Feedback state
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // ✅ FETCH EVENT BY ID
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

  // ⏳ Loading state
  if (!event) {
    return <p className="loading-text">Loading event...</p>;
  }

  // ✅ REGISTER HANDLER
  const handleRegister = () => {
    setRegistered(true);
  };

  // ⭐ FEEDBACK SUBMIT
  const handleSubmitFeedback = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    console.log({
      eventId: id,
      rating,
      feedback,
    });

    setSubmitted(true);
  };

  return (
    <div className="event-details-page">
      <h2 className="event-title">{event.eventName}</h2>

      <div className="event-details-card">
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Organizer:</strong> Faculty</p>

        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
        <p><strong>Location:</strong> {event.venue}</p>

        <p>
          <strong>Status:</strong>{" "}
          {registered ? "Registered" : "Not Registered"}
        </p>

        {/* ✅ REGISTER BUTTON */}
        <button
          className={registered ? "registered-btn" : "register-btn"}
          onClick={handleRegister}
          disabled={registered}
        >
          {registered ? "Registered" : "Register"}
        </button>
      </div>

      {/* ===== FEEDBACK SECTION (ONLY AFTER REGISTER) ===== */}
      {registered && (
        <div className="feedback-section">
          <h3>Give Feedback</h3>

          {submitted ? (
            <p className="feedback-success">
              Thank you for your feedback!
            </p>
          ) : (
            <>
              {/* ⭐ Rating */}
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= rating ? "star active" : "star"}
                    onClick={() => setRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* 📝 Feedback */}
              <textarea
                placeholder="Write your feedback (optional)"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <button
                className="submit-feedback-btn"
                onClick={handleSubmitFeedback}
              >
                Submit Feedback
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentEventDetails;
