import { NavLink } from "react-router-dom";
import "../styles/FacultySidebar.css";

const FacultySidebar = () => {
  return (
    <div className="faculty-sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">E</div>
        <span className="logo-text">EventEase</span>
      </div>

      <nav className="sidebar-menu">
        <NavLink
          to="/faculty/dashboard"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/faculty/events"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Events
        </NavLink>

        <NavLink
          to="/faculty/calendar"
          className={({ isActive }) =>
            isActive ? "menu-item active" : "menu-item"
          }
        >
          Calendar
        </NavLink>
      </nav>
    </div>
  );
};

export default FacultySidebar;