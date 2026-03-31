import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import ForgotPassword from "./pages/ForgotPassword";
import ExploreEvents from "./pages/ExploreEvents";
import ResetPassword from "./pages/ResetPassword";
 import ProtectedRoute from "./pages/ProtectedRoute";

/* ================= STUDENT PAGES ================= */
import StudentLayout from "./pages/student/StudentLayout";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentEvents from "./pages/student/StudentEvents";
import StudentPlacements from "./pages/student/StudentPlacements";
import StudentCalendar from "./pages/student/StudentCalendar";
import StudentProfile from "./pages/student/StudentProfile";
import StudentEventDetails from "./pages/student/StudentEventDetails";
import StudentPlacementDetails from "./pages/student/StudentPlacementDetails";
import StudentFeedback from "./pages/student/StudentFeedback";
import StudentPlacementFeedback from "./pages/student/StudentPlacementFeedback";

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
import FacultyLayout from "./pages/faculty/FacultyLayout";
import FacultyCalendar from "./pages/faculty/FacultyCalendar";
import FacultyDashboard from "./pages/faculty/FacultyDashboard";
import FacultyEvents from "./pages/faculty/FacultyEvents";
import FacultyEventStudents from "./pages/faculty/FacultyEventStudents";

/* ================= PLACEMENT PAGES ================= */
import PlacementDashboard from "./pages/placement/PlacementDashboard";
import Placements from "./pages/placement/Placements";
import PlacementCalendar from "./pages/placement/PlacementCalendar";
import CompaniesVisited from "./pages/placement/CompaniesVisited";
import UpcomingDrives from "./pages/placement/UpcomingDrives";
import PendingRequests from "./pages/placement/PendingRequests";
import PlacementLayout from "./pages/placement/PlacementLayout";

function App() {
  return (
    <Routes>
      {/* ---------- PUBLIC ROUTES ---------- */}
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/events" element={<ExploreEvents />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
    
      {/* ---------- STUDENT ROUTES ---------- */}
      <Route path="/student" element={<ProtectedRoute allowedRole="student"> <StudentLayout /> </ProtectedRoute>}>
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="events" element={<StudentEvents />} />
        <Route path="events/:id" element={<StudentEventDetails />} />
        <Route path="placements" element={<StudentPlacements />} />
        <Route path="placements/:id" element={<StudentPlacementDetails />} />
        <Route path="calendar" element={<StudentCalendar />} />
        <Route path="profile" element={<StudentProfile />} />
        <Route path="events/:id/feedback" element={<StudentFeedback />} />
        <Route path="feedback/:placementId" element={<StudentPlacementFeedback />} />
      </Route>

      {/* ---------- ADMIN ROUTES ---------- */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"> <AdminLayout /> </ProtectedRoute>}>
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
          path="registered/placement/:id"
          element={<AdminRegisteredStudents />}
        />
      </Route>

      {/* ---------- FACULTY ROUTES ----------*/}
      <Route path="/faculty" element={<ProtectedRoute allowedRole="faculty"> <FacultyLayout /> </ProtectedRoute>}> 
        <Route path="dashboard" element={<FacultyDashboard />} />
        <Route path="events" element={<FacultyEvents />} />
        <Route path="calendar" element={<FacultyCalendar />} />
        <Route path="event/:id/students" element={<FacultyEventStudents />} />
      </Route>

      {/* ---------- PLACEMENT ROUTES ---------- */}
      <Route path="/placement" element={<ProtectedRoute allowedRole="placement cell"> <PlacementLayout /> </ProtectedRoute>}> 
        <Route path="dashboard" element={<PlacementDashboard />} />
        <Route path="placements" element={<Placements />} />
        <Route path="companies" element={<CompaniesVisited />} />
        <Route path="calendar" element={<PlacementCalendar />} />
        <Route path="upcoming-drives" element={<UpcomingDrives />} />
        <Route path="pending-requests" element={<PendingRequests />} />
      </Route>

    </Routes>
  );
}

export default App;