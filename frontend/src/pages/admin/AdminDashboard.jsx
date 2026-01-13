import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  // Dummy upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Fest 2026",
      date: "12 Feb 2026",
      organizer: "Aishwariya Garg",
    },
    {
      id: 2,
      title: "Cultural Night",
      date: "20 Feb 2026",
      organizer: "Praveen Kumar",
    },
  ];

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
          <h3>12</h3>
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
            </tr>
          </thead>

          <tbody>
            {upcomingEvents.map((event) => (
              <tr key={event.id}>
                <td>{event.title}</td>
                <td>{event.date}</td>
                <td>{event.organizer}</td>
                <td>
                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(`/admin/registered/event/${event.id}`)
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
