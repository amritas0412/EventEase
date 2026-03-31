import { NavLink } from "react-router-dom";
import "../styles/AdminSidebar.css";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <div className="logo-icon">E</div>
        <span className="logo-text">EventEase</span>
      </div>
      {/* <h2 className="admin-logo">EventEase</h2> */}

      <nav className="admin-menu">
        <NavLink to="/admin/dashboard">Home</NavLink>
        <NavLink to="/admin/events">Events</NavLink>
        <NavLink to="/admin/placements">Placements</NavLink>
        <NavLink to="/admin/users">People</NavLink>
        <NavLink to="/admin/calendar">Calendar</NavLink>
        <NavLink to="/admin/reports">Reports</NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
