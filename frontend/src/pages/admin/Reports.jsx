import { useEffect, useState } from "react";
import "../../styles/Reports.css";

const Reports = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("All");

  useEffect(() => {
    fetch("http://localhost:5050/admin/reports")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeedbacks(data.feedbacks);
        }
      });
  }, []);

  const eventNames = [
    "All",
    ...new Set(feedbacks.map(f => f.eventId?.eventName))
  ];

  const filteredFeedback =
    selectedEvent === "All"
      ? feedbacks
      : feedbacks.filter(
        f => f.eventId?.eventName === selectedEvent
      );
  // ✅ Calculate Average Rating Safely
  const avgRating =
    filteredFeedback.length > 0
      ? (
        filteredFeedback.reduce(
          (acc, curr) => acc + curr.rating,
          0
        ) / filteredFeedback.length
      ).toFixed(1)
      : 0;
  return (
    //   <div className="reports-page">
    //     <h2>Reports & Feedback</h2>

    //     {/* ===== FILTER ===== */}
    //     <div className="report-filter">
    //       <label>Filter by Event:</label>
    //       <select
    //         value={selectedEvent}
    //         onChange={(e) => setSelectedEvent(e.target.value)}
    //       >
    //         {eventNames.map((event, index) => (
    //           <option key={index} value={event}>
    //             {event}
    //           </option>
    //         ))}
    //       </select>
    //     </div>

    //     {/* ===== FEEDBACK LIST ===== */}
    //     {filteredFeedback.length > 0 && (
    //       <div className="report-summary">
    //         <p>
    //           <strong>Average Rating:</strong> ⭐ {avgRating}
    //         </p>
    //         <p>
    //           <strong>Total Reviews:</strong> {filteredFeedback.length}
    //         </p>
    //       </div>
    //     )}
    //     <div className="feedback-list">
    //       {filteredFeedback.map((item) => (
    //         <div key={item._id} className="feedback-card">
    //           <div className="feedback-header">
    //             <span className="event-name">
    //               {item.eventId?.eventName}
    //             </span>
    //             <span className="rating">
    //               {"★".repeat(item.rating)}
    //               {"☆".repeat(5 - item.rating)}
    //             </span>
    //           </div>

    //           {item.comment ? (
    //             <p className="feedback-text">
    //               "{item.comment}"
    //             </p>
    //           ) : (
    //             <p className="no-feedback">
    //               No written feedback
    //             </p>
    //           )}
    //         </div>
    //       ))}

    //       {filteredFeedback.length === 0 && (
    //         <p className="no-feedback">
    //           No feedback available
    //         </p>
    //       )}
    //     </div>
    //   </div>
    <div className="reports-page">
      <h2 className="reports-title">Reports & Feedback</h2>

      {/* FILTER */}
      <div className="report-filter">
        <label>Filter by Event:</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
        >
          {eventNames.map((event, index) => (
            <option key={index} value={event}>
              {event}
            </option>
          ))}
        </select>
      </div>

      {/* SUMMARY CARDS */}
      {filteredFeedback.length > 0 && (
        <div className="report-summary-cards">
          <div className="summary-card">
            <h4>Average Rating</h4>
            <div className="avg-rating">
              ⭐ {avgRating}
            </div>
          </div>

          <div className="summary-card">
            <h4>Total Reviews</h4>
            <div className="review-count">
              {filteredFeedback.length}
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK LIST */}
      <div className="feedback-list">
        {filteredFeedback.map((item) => (
          <div key={item._id} className="feedback-card">
            <div className="feedback-header">
              <span className="event-name">
                {item.eventId?.eventName ||
                  item.placementId?.company}
              </span>
              <span className="rating-stars">
                {"★".repeat(item.rating)}
                {"☆".repeat(5 - item.rating)}
              </span>
            </div>

            {item.comment ? (
              <p className="feedback-text">
                "{item.comment}"
              </p>
            ) : (
              <p className="no-feedback">
                No written feedback
              </p>
            )}
          </div>
        ))}

        {filteredFeedback.length === 0 && (
          <p className="no-feedback">
            No feedback available
          </p>
        )}
      </div>
    </div>
  );
};

export default Reports;