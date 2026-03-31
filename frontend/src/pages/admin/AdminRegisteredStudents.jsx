import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/AdminRegisteredStudents.css";

const AdminRegisteredStudents = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:5050/placement/${id}/registrations`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStudents(data.registrations);
        }
      })
      .catch(err => console.error("FETCH STUDENTS ERROR:", err));
  }, [id]);

  return (
    <div className="admin-registered-page">
      <div className="page-header">
        <h2>Registered Students</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <td>Name</td>
            <td>Email</td>
          </tr>
        </thead>

        <tbody>
          {students.length === 0 ? (
            <tr>
              <td colSpan="2">No students registered</td>
            </tr>
          ) : (
            students.map((student, index) => (
              <tr key={index}>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRegisteredStudents;
