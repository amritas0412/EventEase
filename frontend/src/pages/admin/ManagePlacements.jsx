import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ManagePlacements.css";

const ManagePlacements = () => {
  const navigate = useNavigate();

  const [placements, setPlacements] = useState([]);

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

  return (
    <div className="manage-placements-page">
      <h2 className="page-title">Placements & Internships</h2>

      <div className="table-card">
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
            {placements.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.jobrole}</td>
                <td>{item.date}</td>

                {/* STATUS */}
                <td>
                  <span
                    className={`status ${
                      item.status === "Approved"
                        ? "approved"
                        : item.status === "Rejected"
                        ? "rejected"
                        : "pending"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>

                {/* ACTION BUTTONS */}
                <td>
                  {item.status?.toLowerCase() === "pending" ? (
                    <>
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
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </td>


                {/* DETAILS */}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagePlacements;
