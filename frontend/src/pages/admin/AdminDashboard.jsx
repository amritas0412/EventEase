//import { useNavigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingEvents, setPendingEvents] = useState([]);
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

  // Dummy placement drives
  const upcomingPlacements = [
    {
      id: 1,
      company: "Google",
      role: "Software Engineer",
      date: "15 Mar 2026",
    },
    {
      id: 2,
      company: "Microsoft",
      role: "Frontend Intern",
      date: "25 Mar 2026",
    },
  ];

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
          <h3>18</h3>
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
              <th>View Registered Students</th>
            </tr>
          </thead>

          <tbody>
            {upcomingPlacements.map((placement) => (
              <tr key={placement.id}>
                <td>{placement.company}</td>
                <td>{placement.role}</td>
                <td>{placement.date}</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(
                        `/admin/registered/placement/${placement.id}`
                      )
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

export default AdminDashboard;
