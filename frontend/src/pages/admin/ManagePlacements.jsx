import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ManagePlacements.css";

const ManagePlacements = () => {
  const navigate = useNavigate();

  const [placements, setPlacements] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);

  //  APPROVE HANDLER
  const approvePlacement = async (id) => {
  try {
    await fetch(`http://localhost:5050/admin/placement/status/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });

    fetchPlacements(); // refresh list
  } catch (err) {
    console.log(err);
  }
  };

  //  REJECT HANDLER
  const rejectPlacement = async (id) => {
  try {
    await fetch(`http://localhost:5050/admin/placement/status/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });

    fetchPlacements(); // refresh list
  } catch (err) {
    console.log(err);
  }
  };

  useEffect(() => {
    fetchPlacements();
  }, []);

  const fetchPlacements = async () => {
    try {
      const res = await fetch("http://localhost:5050/placement/all");
      const data = await res.json();
      setPlacements(data.placements);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
  fetch("http://localhost:5050/admin/reports")
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setFeedbacks(data.feedbacks);
      }
    });
}, []);

  const pendingPlacements = placements.filter(
  (p) => p.status?.toLowerCase() === "pending"
);

  const today = new Date();
today.setHours(0, 0, 0, 0); // remove time

  const pastApprovedPlacements = placements.filter((p) => {
  if (p.status?.toLowerCase() !== "approved") return false;

  const driveDate = new Date(p.date);
  driveDate.setHours(0, 0, 0, 0);

  return driveDate < today;
});

const upcomingApprovedPlacements = placements.filter((p) => {
  if (p.status?.toLowerCase() !== "approved") return false;

  const driveDate = new Date(p.date);
  driveDate.setHours(0, 0, 0, 0);

  return driveDate >= today;
});

const getSuccessRate = (appeared, placed) => {
  if (!appeared || appeared === 0) return 0;
  return (placed / appeared) * 100;
};

const getPlacementStats = (placementId) => {
  const placementFeedbacks = feedbacks.filter(
    f =>
      f.type === "placement" &&
      f.placementId?._id === placementId
  );

  const count = placementFeedbacks.length;

  const avg =
    count > 0
      ? (
          placementFeedbacks.reduce(
            (acc, curr) => acc + curr.rating,
            0
          ) / count
        ).toFixed(1)
      : 0;

  return { avg, count };
};

  return (
    <div className="manage-placements-page">
      <h2 className="page-title">Placements & Internships</h2>

      <div className="table-card">
  <h3>Placement Requests</h3>

  <table className="data-table">
    <thead>
      <tr>
        <th>Company</th>
        <th>Job Role</th>
        <th>Date</th>
        <th>Status</th>
        <th>Action</th>
        <th>Details</th>
      </tr>
    </thead>

    <tbody>
      {pendingPlacements.length === 0 ? (
        <tr>
          <td colSpan="6" className="empty-state">
            No pending requests
          </td>
        </tr>
      ) : (
        pendingPlacements.map((item) => {
          const status = item.status?.toLowerCase();

          return (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.jobrole}</td>
              <td>{new Date(item.date).toLocaleDateString("en-CA")}</td>

              <td>
                <span className={`status ${status}`}>
                  {status}
                </span>
              </td>

              <td>
                <button
                  className="approve-btn"
                  onClick={() => approvePlacement(item._id)}
                >
                  Approve
                </button>

                <button
                  className="reject-btn"
                  onClick={() => rejectPlacement(item._id)}
                >
                  Reject
                </button>
              </td>

              <td>
                <button
                  className="details-btn"
                  onClick={() =>
                    navigate(`/admin/placements/${item._id}`)
                  }
                >
                  See Details
                </button>
              </td>
            </tr>
          );
        })
      )}
    </tbody>
  </table>
</div>

<div className="admin-section">
  <h3>Upcoming Approved Drives</h3>

  <table className="data-table">
    <thead>
      <tr>
        <th>Company</th>
        <th>Job Role</th>
        <th>Date</th>
        <th>Details</th>
      </tr>
    </thead>

    <tbody>
      {upcomingApprovedPlacements.length === 0 ? (
        <tr>
          <td colSpan="5" className="empty-state">
            No upcoming approved drives
          </td>
        </tr>
      ) : (
        upcomingApprovedPlacements.map((item) => (
          <tr key={item._id}>
            <td>{item.name}</td>
            <td>{item.jobrole}</td>
            <td>{new Date(item.date).toLocaleDateString("en-CA")}</td>

            <td>
              <button
                className="details-btn"
                onClick={() =>
                  navigate(`/admin/placements/${item._id}`)
                }
              >
                See Details
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
  </div>
  <div className="admin-section">
  <h3>Past Approved Placements</h3>

  <table className="data-table">
    <thead>
      <tr>
  <th>Company</th>
  <th>Job Role</th>
  <th>Date</th>
  <th>Appeared</th>
  <th>Placed</th>
  <th>Success %</th>
  <th>Ratings</th>
  <th>Details</th>
      </tr>
    </thead>

    <tbody>
      {pastApprovedPlacements.length === 0 ? (
        <tr>
          <td colSpan="5" className="empty-state">
            No approved placements yet
          </td>
        </tr>
      ) : (
        pastApprovedPlacements.map((item) => {
          const status = item.status?.toLowerCase();
          const { avg, count } = getPlacementStats(item._id);
const performance = count > 0 ? avg * 20 : 0;
          return (
            <tr key={item._id}>
  <td>{item.name}</td>
  <td>{item.jobrole}</td>
  <td>{new Date(item.date).toLocaleDateString("en-CA")}</td>

  <td>{item.totalAppeared}</td>

  <td>{item.totalPlaced}</td>

  <td>
    {item.totalAppeared > 0 ? (
    <div className="performance-wrapper">
      <div
        className="performance-bar"
        style={{
          width: `${getSuccessRate(item.totalAppeared, item.totalPlaced)}%`
        }}
      ></div>

      <span>
        {getSuccessRate(item.totalAppeared, item.totalPlaced).toFixed(1)}%
      </span>
    </div>
  ) : (
    "—"
  )}
  </td>

  {/* ⭐ AVG RATING */}
  <td>
    {count > 0 ? <>⭐ {avg} ({count})</> : "—"}
  </td>

  <td>
    <button
      className="details-btn"
      onClick={() =>
        navigate(`/admin/placements/${item._id}`)
      }
    >
      See Details
    </button>
  </td>
</tr>
          );
        })
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default ManagePlacements;
