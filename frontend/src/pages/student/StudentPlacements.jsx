import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/StudentPlacements.css";

const StudentPlacements = () => {
  const navigate = useNavigate();

  const [placements, setPlacements] = useState([]);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    fetch("http://localhost:5050/placement/all")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // show only approved ones for students
          const upcoming = data.placements.filter(
            p => p.status === "approved" && p.date >= today
          );
          setPlacements(upcoming);
        }
      })
      .catch(err => console.error("FETCH ERROR:", err));
  }, []);


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
    </div>
  );
};

export default StudentPlacements;
