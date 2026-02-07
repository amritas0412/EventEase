import { Outlet } from "react-router-dom";
import StudentSidebar from "../../component/StudentSidebar";
import "../../styles/StudentLayout.css";

const StudentLayout = () => {
  return (
    <div className="student-layout">
      <StudentSidebar />
      <div className="student-content">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentLayout;

