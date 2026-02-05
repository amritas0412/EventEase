import { useParams } from "react-router-dom";
import { useState } from "react";
import "../../styles/StudentPlacementDetails.css";

const StudentPlacementDetails = () => {
  const { id } = useParams();

  const [registered, setRegistered] = useState(false);
  const [completed] = useState(true);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const placement = {
    company: "Google",
    role: "Software Engineer Intern",
    date: "15 March 2026",
    time: "10:00 AM – 4:00 PM",
    event: "Placement / Internship Drive",
    venue: "Seminar Hall A",
    location: "Bangalore",
    eligibleBranch: "CSE, IT, AI",
    year: "3rd & 4th Year",
    stipend: "₹40,000 / month",
    description:
      "This placement drive provides real-world exposure and industry experience.",
  };

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    console.log({ id, rating, feedback });
    setSubmitted(true);
  };

  return (
    <div className="placement-details-page">
      <h2>{placement.company}</h2>

      {/* ===== DETAILS ===== */}
      <div className="placement-card">
        <p><strong>Job Role:</strong> {placement.role}</p>
        <p><strong>Date:</strong> {placement.date}</p>
        <p><strong>Time:</strong> {placement.time}</p>
        <p><strong>Event:</strong> {placement.event}</p>
        <p><strong>Venue:</strong> {placement.venue}</p>
        <p><strong>Location:</strong> {placement.location}</p>
        <p><strong>Eligible Branch:</strong> {placement.eligibleBranch}</p>
        <p><strong>Year:</strong> {placement.year}</p>
        <p><strong>Stipend:</strong> {placement.stipend}</p>
        <p><strong>Description:</strong> {placement.description}</p>

        <p>
          <strong>Status:</strong>{" "}
          {registered ? "Registered" : "Not Registered"}
        </p>

        {/*  ONLY REGISTER BUTTON */}
        <button
          className={registered ? "registered-btn" : "register-btn"}
          onClick={() => setRegistered(true)}
          disabled={registered}
        >
          {registered ? "Registered" : "Register"}
        </button>
      </div>

      {/* ===== FEEDBACK ===== */}
      {registered && completed && (
        <div className="feedback-section">
          <h3>Feedback</h3>

          {submitted ? (
            <p>Thank you for your feedback!</p>
          ) : (
            <>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span
                    key={s}
                    className={s <= rating ? "star active" : "star"}
                    onClick={() => setRating(s)}
                  >
                    ★
                  </span>
                ))}
              </div>

              <textarea
                placeholder="Optional feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />

              <button onClick={handleSubmitFeedback}>
                Submit Feedback
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentPlacementDetails;
