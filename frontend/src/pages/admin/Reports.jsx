import { useState } from "react";
import "../../styles/Reports.css";

const Reports = () => {
  // Dummy student feedback data (ANONYMOUS)
  const feedbacks = [
    {
      event: "Tech Fest 2026",
      rating: 5,
      feedback: "Excellent event with great speakers.",
    },
    {
      event: "Tech Fest 2026",
      rating: 4,
      feedback: "Very informative but sessions were long.",
    },
    {
      event: "Cultural Night",
      rating: 3,
      feedback: "Enjoyable but sound system needs improvement.",
    },
    {
      event: "Placement Drive",
      rating: 4,
      feedback: "Good companies participated.",
    },
    {
      event: "Placement Drive",
      rating: 5,
      feedback: "", // optional feedback
    },
  ];

  const [selectedEvent, setSelectedEvent] = useState("All");

  // Filter feedback by event
  const filteredFeedback =
    selectedEvent === "All"
      ? feedbacks
      : feedbacks.filter((f) => f.event === selectedEvent);

  return (
    <div className="reports-page">
      <h2>Reports & Feedback</h2>

      {/* ===== FILTER ===== */}
      <div className="report-filter">
        <label>Filter by Event:</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          <option value="All">All Events</option>
          <option value="Tech Fest 2026">Tech Fest 2026</option>
          <option value="Cultural Night">Cultural Night</option>
          <option value="Placement Drive">Placement Drive</option>
        </select>
      </div>

      {/* ===== FEEDBACK LIST ===== */}
      <div className="feedback-list">
        {filteredFeedback.map((item, index) => (
          <div key={index} className="feedback-card">
            <div className="feedback-header">
              <span className="event-name">{item.event}</span>
              <span className="rating">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </span>
            </div>

            {item.feedback ? (
              <p className="feedback-text">"{item.feedback}"</p>
            ) : (
              <p className="no-feedback">No written feedback</p>
            )}
          </div>
        ))}

        {filteredFeedback.length === 0 && (
          <p className="no-feedback">No feedback available</p>
        )}
      </div>
    </div>
  );
};

export default Reports;
