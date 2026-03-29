
import { useState, useEffect } from "react";
import "../../styles/ManageUsers.css";

const ManageUsers = () => {
  const [studentSearch, setStudentSearch] = useState("");
  const [facultySearch, setFacultySearch] = useState("");

  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);

  const [placementCell, setPlacementCell] = useState([]);
  const [placementSearch, setPlacementSearch] = useState("");

  // ================= FETCH DATA =================
  useEffect(() => {
    fetch("http://localhost:5050/admin/students")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudents(data.students);
        }
      });

    fetch("http://localhost:5050/admin/faculty")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFaculty(data.faculty);
        }
      });

      fetch("http://localhost:5050/admin/placement-cell")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPlacementCell(data.placementCell);
          }
        });
  }, []);

  // ================= FILTER =================
  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.studentId?.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const filteredFaculty = faculty.filter(
    (f) =>
      f.name?.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.email?.toLowerCase().includes(facultySearch.toLowerCase())
  );

  const filteredPlacement = placementCell.filter(
  (p) =>
    p.email?.toLowerCase().includes(placementSearch.toLowerCase()) ||
    p.department?.toLowerCase().includes(placementSearch.toLowerCase())
);
  // ================= DELETE =================
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;

    const res = await fetch(
      `http://localhost:5050/admin/student/${id}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (data.success) {
      setStudents(prev => prev.filter(s => s._id !== id));
    }
  };

  const deleteFaculty = async (id) => {
    if (!window.confirm("Delete this faculty?")) return;

    const res = await fetch(
      `http://localhost:5050/admin/faculty/${id}`,
      { method: "DELETE" }
    );

    const data = await res.json();

    if (data.success) {
      setFaculty(prev => prev.filter(f => f._id !== id));
    }
  };

  const deletePlacement = async (id) => {
  if (!window.confirm("Delete this placement cell member?")) return;

  const res = await fetch(
    `http://localhost:5050/admin/placement-cell/${id}`,
    { method: "DELETE" }
  );

  const data = await res.json();

  if (data.success) {
    setPlacementCell(prev => prev.filter(p => p._id !== id));
  }
};

  return (
    <div className="manage-users-page">
      <h2 className="page-title">People Management</h2>

      {/* ================= STUDENTS ================= */}
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
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.studentId}</td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteStudent(student._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
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

      {/* ================= FACULTY ================= */}
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
                <th>Name</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculty.length > 0 ? (
                filteredFaculty.map((fac) => (
                  <tr key={fac._id}>
                    <td>{fac.name}</td>
                    <td>{fac.email}</td>
                    <td>
                      <button
                        className="delete-btn"
                        onClick={() => deleteFaculty(fac._id)}
                      >
                        🗑 Delete
                      </button>
                    </td>
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

      {/* ================= PLACEMENT CELL ================= */}
<div className="table-section">
  <div className="section-header">
    <h3>Placement Cell</h3>
    <input
      type="text"
      placeholder="Search placement cell..."
      className="search-input"
      value={placementSearch}
      onChange={(e) => setPlacementSearch(e.target.value)}
    />
  </div>

  <div className="table-card">
    <table className="data-table">
      <thead>
        <tr>
          <th>Department</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {filteredPlacement.length > 0 ? (
          filteredPlacement.map((p) => (
            <tr key={p._id}>
  <td>{p.department || "N/A"}</td>
  <td>{p.email}</td>
  <td>
    <button
      className="delete-btn"
      onClick={() => deletePlacement(p._id)}
    >
      🗑 Delete
    </button>
  </td>
</tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="no-data">
              No placement cell members found
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
