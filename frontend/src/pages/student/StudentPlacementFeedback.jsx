import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../../styles/StudentFeedback.css";

const StudentPlacementFeedback = () => {
  const { placementId } = useParams(); 
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const studentId = localStorage.getItem("studentId");

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5050/student/placement-feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            placementId, 
            studentId,
            rating,
            comment
          })
        }
      );

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.message || "Error submitting feedback");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <h2>Placement Feedback</h2>

        {submitted ? (
          <div className="feedback-success">
            <p>⭐ Thank you for your feedback!</p>
            <button onClick={() => navigate("/student/placements")}>
              Back to Placements
            </button>
          </div>
        ) : (
          <>
            <p className="feedback-subtitle">
              Please rate your placement experience
            </p>

            {/* Star Rating */}
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

            {/* Comment */}
            <textarea
              placeholder="Write your feedback (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <button className="submit-btn" onClick={handleSubmit}>
              Submit Feedback
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentPlacementFeedback;