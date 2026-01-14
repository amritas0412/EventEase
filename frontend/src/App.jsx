import { Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";

/* ================= STUDENT PAGES ================= */
import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentEvents from "./pages/student/StudentEvents";
import StudentPlacements from "./pages/student/StudentPlacements";
import StudentCalendar from "./pages/student/StudentCalendar";
import StudentProfile from "./pages/student/StudentProfile";
import StudentEventDetails from "./pages/student/StudentEventDetails";
import StudentPlacementDetails from "./pages/student/StudentPlacementDetails";

/* ================= ADMIN PAGES ================= */
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEvents from "./pages/admin/ManageEvents";
import ManagePlacements from "./pages/admin/ManagePlacements";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCalendar from "./pages/admin/ManageCalendar";
import Reports from "./pages/admin/Reports";
import AdminRegisteredStudents from "./pages/admin/AdminRegisteredStudents";
import AdminEventDetails from "./pages/admin/AdminEventDetails";
import AdminPlacementDetails from "./pages/admin/AdminPlacementDetails";

/* ================= FACULTY PAGES ================= */
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyEvents from "./pages/faculty/FacultyEvents";

/* ================= PLACEMENT PAGES ================= */
import PlacementDashboard from "./pages/placement/PlacementDashboard";
import Placements from "./pages/placement/Placements";

function App() {
  return (
    <Routes>
      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />

      {/* ---------- STUDENT ROUTES ---------- */}
      <Route path="/student" element={<StudentLayout />}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="events" element={<StudentEvents />} />
        <Route path="events/:id" element={<StudentEventDetails />} />
        <Route path="placements" element={<StudentPlacements />} />
        <Route
          path="placements/:id"
          element={<StudentPlacementDetails />}
        />
        <Route path="calendar" element={<StudentCalendar />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      {/* ---------- ADMIN ROUTES ---------- */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="events/:id" element={<AdminEventDetails />} />
        <Route path="placements" element={<ManagePlacements />} />
        <Route
          path="placements/:id"
          element={<AdminPlacementDetails />}
        />
        <Route path="users" element={<ManageUsers />} />
        <Route path="calendar" element={<ManageCalendar />} />
        <Route path="reports" element={<Reports />} />
        <Route
          path="registered/:type/:id"
          element={<AdminRegisteredStudents />}
        />
      </Route>

      {/* ---------- FACULTY ROUTES ---------- */}
      <Route path="/faculty">
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="events" element={<FacultyEvents />} />
      </Route>

      {/* ---------- PLACEMENT ROUTES ---------- */}
      <Route path="/placement">
        <Route path="dashboard" element={<PlacementDashboard />} />
        <Route path="placements" element={<Placements />} />
      </Route>

    </Routes>
  );
}

export default App;
