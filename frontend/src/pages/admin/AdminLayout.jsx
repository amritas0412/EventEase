import { Outlet } from "react-router-dom";
import AdminSidebar from "../../component/AdminSidebar";
import "../../styles/AdminLayout.css";

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
