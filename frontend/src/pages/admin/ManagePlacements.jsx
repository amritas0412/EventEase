import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ManagePlacements.css";

const ManagePlacements = () => {
  const navigate = useNavigate();

  //  STATE instead of normal array
  const [placements, setPlacements] = useState([
    {
      id: 1,
      company: "Google",
      role: "Software Engineer",
      type: "Placement",
      date: "20 March 2026",
      status: "Pending",
    },
    {
      id: 2,
      company: "Microsoft",
      role: "Frontend Intern",
      type: "Internship",
      date: "5 April 2026",
      status: "Pending",
    },
  ]);

  //  APPROVE HANDLER
  const approvePlacement = (id) => {
    setPlacements((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Approved" } : item
      )
    );
  };

  //  REJECT HANDLER
  const rejectPlacement = (id) => {
    setPlacements((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "Rejected" } : item
      )
    );
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
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {placements.map((item) => (
              <tr key={item.id}>
                <td>{item.company}</td>
                <td>{item.role}</td>
                <td>{item.type}</td>
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
                  {item.status === "Pending" ? (
                    <>
                  <button
                    className="approve-btn"
                    onClick={() => approvePlacement(item.id)}
                    //disabled={item.status !== "Pending"}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => rejectPlacement(item.id)}
                    //disabled={item.status !== "Pending"}
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
                      navigate(`/admin/placements/${item.id}`)
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
