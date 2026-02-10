import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/StudentPlacementDetails.css";

const StudentPlacementDetails = () => {
  const { id } = useParams();

  const [registered, setRegistered] = useState(false);
  const [completed] = useState(true);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const [placement, setPlacement] = useState(null);

  const studentId = localStorage.getItem("studentId");

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    console.log({ id, rating, feedback });
    setSubmitted(true);
  };

  useEffect(() => {
    fetch(`http://localhost:5050/placement/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlacement(data.placement);
        }
      })
      .catch(err => console.error("DETAIL FETCH ERROR:", err));
  }, [id]);

  useEffect(() => {
    if (!studentId) return;

    fetch(`http://localhost:5050/student/registration/check?studentId=${studentId}&placementId=${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.registered) {
          setRegistered(true);
        }
      })
      .catch(err => console.error(err));
  }, [id, studentId]);

  const handleRegister = async () => {
    try {
      const res = await fetch(
        "http://localhost:5050/student/register/placement",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            studentId: studentId,
            placementId: id,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        alert("✅ Registered successfully");
        setRegistered(true);
      } else {
        alert(data.message || "Already registered");
        setRegistered(true);
      }
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      alert("❌ Server error");
    }
  };

  if (!placement) return <p>Loading...</p>;

  return (
    <div className="placement-details-page">
      <h2>{placement.name}</h2>

      {/* ===== DETAILS ===== */}
      <div className="placement-card">
        <p><strong>Job Role:</strong> {placement.jobrole}</p>
        <p><strong>Date:</strong> {placement.date}</p>
        <p><strong>Time:</strong> {placement.time} – {placement.endtime}</p>
        <p><strong>Venue:</strong> {placement.venue}</p>
        <p><strong>Location:</strong> {placement.location}</p>
        <p><strong>Eligible:</strong> {placement.audience}</p>
        <p><strong>Stipend:</strong> ₹{placement.stipend} / month</p>
        <p><strong>Description:</strong> {placement.description}</p>

        <p>
          <strong>Status:</strong>{" "}
          {registered ? "Registered" : "Not Registered"}
        </p>

        {/*  ONLY REGISTER BUTTON */}
        <button
          className={registered ? "registered-btn" : "register-btn"}
          onClick={handleRegister}
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
