import { useParams } from "react-router-dom";
import { useState } from "react";
import "../../styles/StudentEventDetails.css";

const StudentEventDetails = () => {
  const { id } = useParams();

  // Dummy event data
  const event = {
    id,
    title: "Tech Fest 2026",
    description:
      "Tech Fest 2026 is a national-level technical festival featuring hackathons, coding contests, and tech talks.",
    organizer: "Computer Science Department",
    date: "12 February 2026",
    time: "10:00 AM - 5:00 PM",
    location: "Main Auditorium",
  };

  // ✅ REGISTER STATE
  const [registered, setRegistered] = useState(false);

  // ⭐ Feedback state
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

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
      <h2 className="event-title">{event.title}</h2>

      <div className="event-details-card">
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Organizer:</strong> {event.organizer}</p>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Location:</strong> {event.location}</p>
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
