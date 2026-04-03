import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PlacementDashboard.css";

const UpcomingDrives = () => {
  const navigate = useNavigate();
  const [drives, setDrives] = useState([]);
  const today = new Date();
today.setHours(0, 0, 0, 0);

  useEffect(() => {
    fetch("http://localhost:5050/placement/all")
      .then(res => res.json())
      .then(data => {
        const upcoming = data.placements.filter((d) => {
  if (d.status !== "approved") return false;

  const driveDate = new Date(d.date);
  driveDate.setHours(0, 0, 0, 0);

  return driveDate >= today;
});
        setDrives(upcoming);
      })
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="placement-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">E</div>
          <span className="logo-text">EventEase</span>
        </div>
        <ul>
          <li onClick={() => navigate("/placement/dashboard")}>
            📊 Dashboard
          </li>
          <li className="active">📅 Upcoming Drives</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2>📅 Upcoming Drives</h2>

        <div className="panel-grid">
          {drives.length > 0 ? (
            drives.map((drive, index) => (
              <div key={index} className="event-card">
                <h4>{drive.name}</h4>
                <p>
                  Date: {new Date(drive.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>
                  👥 Registered Students:{" "}
                  <strong>{drive.totalRegistrations || 0}</strong>
                </p>
              </div>
            ))
          ) : (
            <div className="event-card empty-card">
              <p>No upcoming drives</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UpcomingDrives;