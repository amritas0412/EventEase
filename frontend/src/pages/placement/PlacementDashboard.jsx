import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PlacementDashboard.css"; //  FIXED PATH
import { companies } from "../../data/companiesData";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const PlacementDashboard = () => {
  const isLoggedIn = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!localStorage.getItem("role")) {
    return <Navigate to="/login" replace />;
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const [placements, setPlacements] = useState([]);
  const today = new Date();
  const totalDrives = Array.isArray(placements)
    ? placements.filter(d => d.status !== "rejected").length
    : 0;
  const [feedbackMap, setFeedbackMap] = useState({});

  useEffect(() => {
    fetch("http://localhost:5050/placement/all")  
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setPlacements(data.placements);
      })
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      const map = {};

      for (const drive of completedDrives) {
        try {
          const res = await fetch(
            `http://localhost:5050/placement/feedback-summary/${drive._id}`
          );
          const data = await res.json();

          if (data.success) {
            map[drive._id] = data;
          }
        } catch (err) {
          console.error(err);
        }
      }
      setFeedbackMap(map);
    };

    if (completedDrives.length > 0) {
      fetchFeedbacks();
    }
  }, [placements]);
  
  // Drives that already occurred (history)
  const completedDrives = Array.isArray(placements)
    ? placements.filter((d) => new Date(d.date) < today && d.status === "approved")
    : [];

  const upcomingDrives = Array.isArray(placements)
    ? placements.filter((d) => d.status === "approved" && new Date(d.date) >= today).length
    : 0;

  const pendingRequests = Array.isArray(placements)
    ? placements.filter((d) => d.status === "pending").length
    : 0;

  const companiesVisited = [
    ...new Set(completedDrives.map(d => d.name))
  ].length;

  const handleLogout = () => {
    localStorage.removeItem("role"); 
    navigate("/login", { replace: true });
  };

  const [showResultForm, setShowResultForm] = useState(false);
  const [currentDriveId, setCurrentDriveId] = useState(null);

  // For input values
  const [appeared, setAppeared] = useState("");
  const [placed, setPlaced] = useState("");

  const updateResult = async (id) => {
    console.log("Update result for", id);
    await fetch(`http://localhost:5050/placement/result/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    });

    alert("Updated");
  };

  const handleSaveResult = async () => {
    if (!currentDriveId) return;

    try {
      await fetch(`http://localhost:5050/placement/result/${currentDriveId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          totalAppeared: Number(appeared),
          totalPlaced: Number(placed),
        }),
      });

      alert("Updated successfully");
      setShowResultForm(false);

      // Refresh placements
      const res = await fetch("http://localhost:5050/placement/all");
      const data = await res.json();
      if (data.success) setPlacements(data.placements);
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="placement-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="brand">EventEase</h2>

        <ul>
          <li className="active">📊 Dashboard</li>
          <li
            onClick={() => navigate("/placement/placements")}
            style={{ cursor: "pointer" }}
          >
            📅 Placements
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Profile */}
        <div className="top-bar-profile">
          <div
            className="profile-icon"
            onClick={() => setShowProfile(!showProfile)}
          >
            👤
          </div>

          {showProfile && (
            <div className="profile-dropdown">
              <p className="profile-name">Placement Cell</p>
              <p className="profile-email">placementcell@banasthali.in</p>

              <p className="profile-stat">
                Total Placement Drives: <strong>{totalDrives}</strong>
              </p>

              <button className="profile-btn" onClick={() => navigate("/placement/calendar")}>
                📅 View Calendar
              </button>

              <button
                className="profile-btn logout"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* Summary Cards */}
        <section className="stats">
          <div className="card clickable"
            onClick={() => navigate("/placement/upcoming-drives")}>
            <h3>📅 Upcoming Drives</h3>
            <h2>{upcomingDrives}</h2>
            <p>Approved placement drives</p>
          </div>

          <div 
            className="card clickable"
            onClick={() => navigate("/placement/pending-requests")}
          >
            <h3>⏳ Pending Requests</h3>
            <h2>{pendingRequests}</h2>
            <p>Awaiting admin approval</p>
          </div>

          <div className="card clickable"
            onClick={() => navigate("/placement/companies")}>
            <h3>🏢 Companies Visited</h3>
            <h2>{companiesVisited}</h2>
            <p>Total companies</p>
          </div>

        </section>

        {/*History*/}
        <section className="panel">
          <div className="panel-header">
            <h3>🕘 Placement History</h3>
          </div>

          <div className="panel-grid">
            {completedDrives.length > 0 ? (
              completedDrives.map((drive, index) => (
                <div key={index} className="event-card dashboard-card">
                  <h4>{drive.name}</h4>
                  <p>Date: {new Date(drive.date).toLocaleDateString("en-GB")}</p>
                  <p className="muted-text">
                    Total Registrations: {drive.totalRegistrations || "0"}
                  </p>
                  <p>Total Appeared: {drive.totalAppeared}</p>
                  <p>Total Placed: {drive.totalPlaced}</p>
                  <p>
                    Feedback:{" "}
                    {feedbackMap[drive._id]?.totalFeedbacks > 0
                      ? `⭐ ${feedbackMap[drive._id].avgRating} 
                        (${feedbackMap[drive._id].totalFeedbacks} reviews)`
                      : "—"}
                  </p>
                  <button
                    onClick={() => {
                      setCurrentDriveId(drive._id);          // store which drive
                      setAppeared(drive.totalAppeared || ""); // prefill existing numbers
                      setPlaced(drive.totalPlaced || "");
                      setShowResultForm(true);                // show popup
                    }}
                  >
                    Update Result
                  </button>

                </div>
              ))
            ) : (
              <div className="event-card dashboard-card empty-card">
                <p>Placement history will appear here</p>
              </div>
            )}
          </div>
        </section>
        
        {showResultForm && (
          <div className="popup-overlay">
            <div className="popup-content">
              <h3>Update Result</h3>

              <div className="popup-field">
                <label>Total Appeared:</label>
                <input
                  type="number"
                  value={appeared}
                  onChange={(e) => setAppeared(e.target.value)}
                />
              </div>

              <div className="popup-field">
                <label>Total Placed:</label>
                <input
                  type="number"
                  value={placed}
                  onChange={(e) => setPlaced(e.target.value)}
                />
              </div>

              <div className="popup-buttons">
                <button onClick={handleSaveResult}>Save</button>
                <button onClick={() => setShowResultForm(false)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default PlacementDashboard;
