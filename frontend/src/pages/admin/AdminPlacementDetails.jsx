import { useParams, useNavigate } from "react-router-dom";
import "../../styles/AdminPlacementDetails.css";

const AdminPlacementDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy placement data (later can come from backend)
  const placement = {
    id,
    company: "Google",
    role: "Software Engineer",
    date: "20 March 2026",
    time: "10:00 AM",
    venue: "Main Seminar Hall",
    location: "Block A, Campus",
    eligibleBranch: "CSE, IT",
    eligibleYear: "3rd & 4th Year",
    stipend: "₹50,000 / month",
    description:
      "Google is conducting a placement drive for Software Engineer roles focusing on DSA, System Design, and Problem Solving.",
  };

  return (
    <div className="admin-details-page">
      <h2 className="page-title">Placement Details</h2>

      <div className="details-card">
        <p><strong>Company:</strong> {placement.company}</p>
        <p><strong>Job Role:</strong> {placement.role}</p>
        <p><strong>Date:</strong> {placement.date}</p>
        <p><strong>Time:</strong> {placement.time}</p>
        <p><strong>Venue:</strong> {placement.venue}</p>
        <p><strong>Location:</strong> {placement.location}</p>
        <p><strong>Eligible Branch:</strong> {placement.eligibleBranch}</p>
        <p><strong>Eligible Year:</strong> {placement.eligibleYear}</p>
        <p><strong>Stipend:</strong> {placement.stipend}</p>
        <p><strong>Description:</strong> {placement.description}</p>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default AdminPlacementDetails;
