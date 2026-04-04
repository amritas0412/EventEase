import { useEffect, useState } from "react";
import "../../styles/Reports.css";

const Reports = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedItem, setSelectedItem] = useState("All");

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
    ...new Set(
      feedbacks.map(
        f =>
          f.type === "event"
            ? f.eventId?.eventName
            : f.placementId?.name || f.placementId?.company
      )
    )
  ];

  const filteredFeedback =
    selectedItem === "All"
      ? feedbacks
      : feedbacks.filter(f => {
        const name =
          f.type === "event"
            ? f.eventId?.eventName
            : f.placementId?.name || f.placementId.company;

        return name === selectedItem;
      });
  //Calculate Average Rating Safely
  const avgRating =
    filteredFeedback.length > 0
      ? (
        filteredFeedback.reduce(
          (acc, curr) => acc + curr.rating,
          0
        ) / filteredFeedback.length
      ).toFixed(1)
      : 0;

  const getItemName = (f) =>
    f.type === "event"
      ? f.eventId?.eventName
      : f.placementId?.name || f.placementId?.company;

  const avgByItem = Object.values(
    filteredFeedback.reduce((acc, curr) => {
      const name = getItemName(curr);
      if (!name) return acc;

      if (!acc[name]) {
        acc[name] = { name, total: 0, count: 0 };
      }

      acc[name].total += curr.rating;
      acc[name].count += 1;

      return acc;
    }, {})
  ).map(item => ({
    name: item.name,
    avg: (item.total / item.count).toFixed(1),
    count: item.count
  }));

  return (
    <div className="reports-page">
      <h2 className="reports-title">Reports & Feedback</h2>

      {/* FILTER */}
      <div className="report-filter">
        <label>Filter by Event / Placement:</label>
        <select
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
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

      {/* ===== AVERAGE PER EVENT/PLACEMENT ===== */}
      {avgByItem.length > 0 && (
        <div className="report-breakdown">
          <h3>Average Rating by Event / Placement</h3>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Drive</th>
                <th>Average Rating</th>
                <th>Total Reviews</th>
              </tr>
            </thead>

            <tbody>
              {avgByItem.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>⭐ {item.avg}</td>
                  <td>{item.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* FEEDBACK LIST */}
      <div className="feedback-list">
        {filteredFeedback.map((item) => (
          <div
            key={item._id}
            className="feedback-card"
            data-rating={item.rating}   
          >
            <div className="feedback-header">
              <span className="event-name">
                {item.type === "event"
                  ? item.eventId?.eventName
                  : item.placementId?.name || item.placementId?.company}
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