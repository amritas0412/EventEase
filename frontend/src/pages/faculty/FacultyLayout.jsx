// import { Outlet, Navigate } from "react-router-dom";
// import FacultySidebar from "../../component/FacultySidebar";
// import "../../styles/FacultyLayout.css";

// const FacultyLayout = () => {
//   const role = localStorage.getItem("role");

//   if (role !== "faculty") {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="faculty-layout">
//       <FacultySidebar />
//       <div className="faculty-content">
//         <Outlet />
//       </div>
//     </div>
//   );
// };

// export default FacultyLayout;
import { Outlet, Navigate } from "react-router-dom";
import FacultySidebar from "../../component/FacultySidebar";
import "../../styles/FacultyLayout.css";

const FacultyLayout = () => {
  const role = localStorage.getItem("role");

  if (role !== "faculty") {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="faculty-layout">
      <FacultySidebar />
      <div className="faculty-content">
        <Outlet />
      </div>
    </div>
  );
};

export default FacultyLayout;
