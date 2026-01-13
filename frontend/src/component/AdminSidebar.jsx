import { NavLink } from "react-router-dom";
import "../styles/AdminSidebar.css";

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <h2 className="admin-logo">EventEase</h2>

      <nav className="admin-menu">
        <NavLink to="/admin/dashboard">Home</NavLink>
        <NavLink to="/admin/events">Events</NavLink>
        <NavLink to="/admin/placements">Placements</NavLink>
        <NavLink to="/admin/users">Peoples</NavLink>
        <NavLink to="/admin/calendar">Calendar</NavLink>
        <NavLink to="/admin/reports">Reports</NavLink>
      </nav>
    </div>
  );
};

export default AdminSidebar;
