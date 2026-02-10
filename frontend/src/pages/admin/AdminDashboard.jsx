//import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingEvents, setPendingEvents] = useState([]);
  const [placements, setPlacements] = useState([]);

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
    navigate("/login");
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

        <button className="admin-logout-btn" onClick={handleLogout}>
          Logout
        </button>
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
          <h3>123</h3>
        </div>
      </div>

      {/* ===== UPCOMING EVENTS ===== */}
      <div className="admin-section">
        <h3>Upcoming Events</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Date</th>
              <th>Organizer</th>
              <th>View Registered Students</th>
              <th>Action</th>   {/* 👈 add this */}
            </tr>
          </thead>
          <tbody>
            {approvedEvents.length === 0 ? (
              <tr>
                <td colSpan="5">No upcoming events</td>
              </tr>
            ) : (
              approvedEvents.map(event => (
                <tr key={event._id}>
                  <td>{event.eventName}</td>
                  <td>{event.date}</td>
                  <td>Faculty</td>

                  <td>
                    <button
  className="details-btn"
  onClick={() =>
    navigate(`/admin/registered/event/${event._id}`)
  }
>
  See Details
</button>

                  </td>

                  <td>Approved</td>
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
                  <td>{new Date(placement.date).toLocaleDateString()}</td>
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
