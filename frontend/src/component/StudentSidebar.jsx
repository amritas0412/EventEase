import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/StudentSidebar.css";

const StudentSidebar = () => {

  const [eventCount, setEventCount] = useState(0);

  // 🔥 Fetch approved events count
  useEffect(() => {
    fetch("http://localhost:5050/faculty/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEventCount(data.events.length);
        }
      })
      .catch(err =>
        console.error("SIDEBAR COUNT ERROR:", err)
      );
  }, []);

  return (
    <div className="student-sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo-icon">E</div>
        <span className="logo-text">EventEase</span>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">

        <NavLink
          to="/student/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/student/events"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Events
          <span className="badge">{eventCount}</span>
        </NavLink>

        <NavLink
          to="/student/placements"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Placements
        </NavLink>

      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <span className="settings-text">Settings</span>
      </div>
    </div>
  );
};

export default StudentSidebar;
