import { useState } from "react";
import "../../styles/ManageUsers.css";

const ManageUsers = () => {
  // ================= STATE =================
  const [studentSearch, setStudentSearch] = useState("");
  const [facultySearch, setFacultySearch] = useState("");

  // Dummy student users
  const students = [
    {
      id: "BTBTC23292",
      name: "Ritika Bhandari",
      email: "ritika@student.edu",
      year: "3rd Year",
    },
    {
      id: "BTBTC23245",
      name: "Aman Verma",
      email: "aman@student.edu",
      year: "4th Year",
    },
  ];

  // Dummy faculty users
  const faculty = [
    {
      id: "FAC102",
      name: "Prof. Navin Mathur",
      email: "navin@faculty.edu",
    },
    {
      id: "FAC108",
      name: "Dr. Rajesh Kumar",
      email: "rajesh@faculty.edu",
    },
  ];

  // ================= FILTER LOGIC =================
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.id.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredFaculty = faculty.filter(
    (f) =>
      f.name.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.id.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.email.toLowerCase().includes(facultySearch.toLowerCase())
  );

  return (
    <div className="manage-users-page">
      <h2 className="page-title">Manage Users</h2>

      {/* ================= STUDENT TABLE ================= */}
      <div className="table-section">
        <div className="section-header">
          <h3>Students</h3>

          <input
            type="text"
            placeholder="Search students..."
            className="search-input"
            value={studentSearch}
            onChange={(e) => setStudentSearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email ID</th>
                <th>Year</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student.id}>
                    <td>{student.id}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.year}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= FACULTY TABLE ================= */}
      <div className="table-section">
        <div className="section-header">
          <h3>Faculty</h3>

          <input
            type="text"
            placeholder="Search faculty..."
            className="search-input"
            value={facultySearch}
            onChange={(e) => setFacultySearch(e.target.value)}
          />
        </div>

        <div className="table-card">
          <table className="data-table">
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Name</th>
                <th>Email ID</th>
              </tr>
            </thead>

            <tbody>
              {filteredFaculty.length > 0 ? (
                filteredFaculty.map((fac) => (
                  <tr key={fac.id}>
                    <td>{fac.id}</td>
                    <td>{fac.name}</td>
                    <td>{fac.email}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    No faculty found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
