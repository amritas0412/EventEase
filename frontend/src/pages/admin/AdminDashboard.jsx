// import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/AdminDashboard.css";
import { Navigate } from "react-router-dom";

const AdminDashboard = () => {

  const isLoggedIn = localStorage.getItem("role");

if (!isLoggedIn) {
  return <Navigate to="/login" replace />;
}

if (!localStorage.getItem("role")) {
  return <Navigate to="/login" replace />;
}

  const navigate = useNavigate();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [stats, setStats] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);
  useEffect(() => {
    fetch("http://localhost:5050/admin/event-requests")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPendingEvents(data.events);
        }
      })
      .catch(err => console.error(err));
  }, []);
  useEffect(() => {
    fetch("http://localhost:5050/admin/dashboard-stats")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data);
        }
      });
  }, []);
  const approve = async (id) => {
    await fetch(`http://localhost:5050/admin/events/${id}/approve`, {
      method: "PATCH",
    });

    setPendingEvents(prev => prev.filter(ev => ev._id !== id));
  };

  const reject = async (id) => {
    await fetch(`http://localhost:5050/admin/events/${id}/reject`, {
      method: "PATCH",
    });

    setPendingEvents(prev => prev.filter(ev => ev._id !== id));
  };

  useEffect(() => {
    fetch("http://localhost:5050/placement/all")
      .then(res => res.json())
      .then(data => {
        if (data.placements) {
          setPlacements(data.placements);
        }
      })
      .catch(err => console.error(err));
  }, []);
  const approvedPlacementCount = Array.isArray(placements)
    ? placements.filter(p => p.status === "approved").length
    : 0;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };
  const [approvedEvents, setApprovedEvents] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5050/admin/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApprovedEvents(data.events);
        }
      });
  }, []);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = approvedEvents.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    return (
      event.status === "approved" &&
      eventDate >= today
    );
  });

  const upcomingPlacements = Array.isArray(placements)
    ? placements.filter(
      p => p.status === "approved" && new Date(p.date) >= today
    )
    : [];

  return (
    <div className="admin-dashboard-page">
      {/* ===== TOP BAR ===== */}
      <div className="admin-topbar">
        <h2>Admin Dashboard</h2>

        {/* <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button> */}
        <div className="profile-container">
          <div
            className="profile-icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
          >
            👤
          </div>

          {showDropdown && (
            <div className="profile-dropdown">
              <p className="profile-email">
                {localStorage.getItem("email")}
              </p>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="admin-cards">
        <div className="admin-card">
          <p>Total Events</p>
          <h3>{approvedEvents.length}</h3>
        </div>

        <div className="admin-card">
          <p>Placement Drive</p>
          <h3>{approvedPlacementCount}</h3>
        </div>

        <div className="admin-card">
          <p>Registered Users</p>
          <h3>{stats.totalUsers || 0}</h3>
        </div>
      </div>

      {/* ===== UPCOMING EVENTS ===== */}
      <div className="admin-section">
        <h3>Upcoming Events</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Organizer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Registered Students</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {upcomingEvents.length === 0 ? (
              <tr>
                <td colSpan="5">No upcoming events</td>
              </tr>
            ) : (
              upcomingEvents.map(event => (
                <tr key={event._id}>
                  <td>{event.eventName}</td>
                  <td>{event.conductedBy ? event.conductedBy.name : "Admin"}</td>
                  <td>{new Date(event.date).toLocaleDateString("en-CA")}</td>
                  <td>{event.status}</td>
                  <td>{event.registeredCount || 0}</td>
                  <td>
                    <button
                      onClick={() => navigate(`/admin/events/${event._id}`)}
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

      {/* ===== UPCOMING PLACEMENTS ===== */}
      <div className="admin-section">
        <h3>Upcoming Placements</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Drive Details</th>
              <th>Registered Students</th>
            </tr>
          </thead>

          <tbody>
            {upcomingPlacements.length === 0 ? (
              <tr>
                <td colSpan="4">No upcoming placements</td>
              </tr>
            ) : (
              upcomingPlacements.map((placement) => (
                <tr key={placement._id}>
                  <td>{placement.name}</td>
                  <td>{placement.jobrole}</td>
                  <td>{new Date(placement.date).toLocaleDateString("en-CA")}</td>
                  <td>{placement.venue || "—"}</td>
                  <td>
                    <button
                      className="details-btn"
                      onClick={() =>
                        navigate(`/admin/placements/${placement._id}`)
                      }
                    >
                      View
                    </button>
                  </td>
                  <td>
                    <button
                      className="details-btn"
                      onClick={() =>
                        navigate(`/admin/registered/placement/${placement._id}`)
                      }
                    >
                      View Students
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
