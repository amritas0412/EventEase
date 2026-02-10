import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/AdminPlacementDetails.css";

const AdminPlacementDetails = () => {
  const { id } = useParams();
  console.log("ID FROM URL:", id);

  const navigate = useNavigate();

  const [placement, setPlacement] = useState(null);

  //Fetch placement from backend
  useEffect(() => {
    fetch(`http://localhost:5050/placement/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlacement(data.placement);
        }
      })
      .catch(err => console.error("DETAIL ERROR:", err));
  }, [id]);

  // Loading state
  if (!placement) {
    return <p>Loading placement details...</p>;
  }

  return (
    <div className="admin-details-page">
      <h2 className="page-title">Placement Details</h2>

      <div className="details-card">
        <p><strong>Company:</strong> {placement.name}</p>
        <p><strong>Job Role:</strong> {placement.jobrole}</p>
        <p><strong>Date:</strong> {placement.date}</p>
        <p><strong>Time:</strong> {placement.time} to {placement.endtime}</p>
        <p><strong>Venue:</strong> {placement.venue}</p>
        <p><strong>Location:</strong> {placement.location}</p>
        <p><strong>Eligible:</strong> {placement.audience}</p>
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
