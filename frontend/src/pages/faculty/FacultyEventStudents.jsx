import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/FacultyEventStudents.css";

const FacultyEventStudents = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5050/faculty/event/${id}/students`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudents(data.students);
        }
      })
      .catch(err => console.error("FETCH ERROR:", err));
  }, [id]);

  return (
    <div className="students-page">

      <div className="students-header">
        <h2 className="students-title">Registered Students</h2>

        <div className="header-right">
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>

          <span className="students-count">
            {students.length} Students
          </span>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="empty-state">
          No students have registered for this event yet.
        </div>
      ) : (
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Student ID</th>
            </tr>
          </thead>
          <tbody>
            {students.map((reg) => (
              <tr key={reg._id}>
                <td>{reg.studentId?.name}</td>
                <td>{reg.studentId?.email}</td>
                <td>{reg.studentId?.studentId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default FacultyEventStudents;