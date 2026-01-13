import { useNavigate } from "react-router-dom";
import "../../styles/StudentPlacements.css";

const StudentPlacements = () => {
  const navigate = useNavigate();

  const placements = [
    {
      id: 1,
      company: "Google",
      role: "Software Engineer",
      type: "Placement",
      location: "Bangalore",
      date: "20 March 2026",
    },
    {
      id: 2,
      company: "Microsoft",
      role: "Frontend Intern",
      type: "Internship",
      location: "Hyderabad",
      date: "5 April 2026",
    },
    {
      id: 3,
      company: "Amazon",
      role: "Data Analyst",
      type: "Placement",
      location: "Pune",
      date: "18 April 2026",
    },
  ];

  return (
    <div className="placements-page">
      <h2 className="placements-title">Placements & Internships</h2>

      <div className="placements-list">
        {placements.map((item) => (
          <div className="placement-card" key={item.id}>
            <h3>{item.company}</h3>
            <p><strong>Role:</strong> {item.role}</p>
            <p><strong>Type:</strong> {item.type}</p>
            <p><strong>Location:</strong> {item.location}</p>
            <p><strong>Date:</strong> {item.date}</p>

            {/* ✅ ONLY NAVIGATION BUTTON */}
            <button
              className="apply-btn"
              onClick={() =>
                navigate(`/student/placements/${item.id}`)
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
