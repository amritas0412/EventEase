import { Outlet, Navigate } from "react-router-dom";

const FacultyLayout = () => {
  const role = localStorage.getItem("role");

  // 🔐 Protect faculty routes
  if (role !== "faculty") {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default FacultyLayout;
