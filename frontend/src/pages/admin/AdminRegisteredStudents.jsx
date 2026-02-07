import { useParams, useNavigate } from "react-router-dom";
import "../../styles/AdminRegisteredStudents.css";

const AdminRegisteredStudents = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy registered students data
  const students = [
    {
      id: 1,
      name: "Ritika Bhandari",
      email: "ritika@gmail.com",
      //department: "CSE",
      year: "3rd Year",
    },
    {
      id: 2,
      name: "Aashi Verma",
      email: "aashi@gmail.com",
      //department: "IT",
      year: "4th Year",
    },
    {
      id: 3,
      name: "Neha Sharma",
      email: "neha@gmail.com",
      //department: "ECE",
      year: "3rd Year",
    },
  ];

  return (
    <div className="admin-registered-page">
      <div className="page-header">
        <h2>Registered Students (Event: {eventName})</h2>
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            {/*<th>Department</th>*/}
            <th>Year</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              {/*<td>{student.department}</td>*/}
              <td>{student.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminRegisteredStudents;
