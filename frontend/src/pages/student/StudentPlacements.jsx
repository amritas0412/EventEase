import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/StudentPlacements.css";

const StudentPlacements = () => {
  const navigate = useNavigate();

  const [placements, setPlacements] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  const [pastPlacements, setPastPlacements] = useState([]);
  const studentId = localStorage.getItem("studentId");


  useEffect(() => {
    fetch("http://localhost:5050/placement/all")
      .then(res => res.json())
      .then(async (data) => {

        if (data.success) {
          // show only approved ones for students
          const upcoming = data.placements.filter(
            p => p.status === "approved" && p.date >= today
          );
          setPlacements(upcoming);

          if (studentId) {
            const regRes = await fetch(
              `http://localhost:5050/student/my-placements/${studentId}`
            );
            const regData = await regRes.json();

            if (regData.success) {
              const pastRegistered = (regData.placements || []).filter(r => {

                const todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);

                if (!r.placementId?.date) return false;

                const driveDate = new Date(r.placementId.date);
                driveDate.setHours(0, 0, 0, 0);

                return driveDate < todayDate;
              });
              setPastPlacements(pastRegistered);
            }
          }
        }
      })
      .catch(err => console.error("FETCH ERROR:", err));
  }, [studentId, today]);
  return (
    <div className="placements-page">
      <h2 className="placements-title">Placements & Internships</h2>

      <div className="placements-list">
        {placements.map((item) => (
          <div className="placement-card" key={item._id}>
            <h3>{item.name}</h3>
            <p><strong>Role:</strong> {item.jobrole}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Date:</strong> {item.date}</p>

            {/* ✅ ONLY NAVIGATION BUTTON */}
            <button
              className="apply-btn"
              onClick={() =>
                navigate(`/student/placements/${item._id}`)
              }
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* ===== PAST DRIVES ===== */}
      <h2 className="placements-title">Past Drives Attended</h2>

      <div className="placements-list">
        {pastPlacements.length === 0 ? (
          <p>No past drives</p>
        ) : (
          pastPlacements.map((item) => (
            <div className="placement-card" key={item._id || item.placementId?._id}>
              <h3>{item.placementId?.name}</h3>
              <p><strong>Role:</strong> {item.placementId?.jobrole}</p>
              <p><strong>Date:</strong> {item.placementId?.date}</p>

              <button
                className="apply-btn"
                onClick={() =>
                  navigate(`/student/feedback/${item.placementId?._id}`)
                }
              >
                Give Feedback
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentPlacements;
