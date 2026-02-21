// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";

// const FacultyEventStudents = () => {
//   const { id } = useParams();
//   const [students, setStudents] = useState([]);

//   useEffect(() => {
//     fetch(`http://localhost:5050/faculty/event/${id}/students`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           setStudents(data.students);
//         }
//       })
//       .catch(err => console.error("FETCH ERROR:", err));
//   }, [id]);

//   return (
//     <div style={{ padding: "30px" }}>
//       <h2>Registered Students</h2>

//       {students.length === 0 ? (
//         <p>No students registered yet.</p>
//       ) : (
//         <table border="1" cellPadding="10">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Student ID</th>
//             </tr>
//           </thead>
//           <tbody>
//   {students.map((reg) => (
//     <tr key={reg._id}>
//       <td>{reg.studentId?.name}</td>
//       <td>{reg.studentId?.email}</td>
//       <td>{reg.studentId?.studentId}</td>
//     </tr>
//   ))}
// </tbody>


//         </table>
//       )}
//     </div>
//   );
// };

// export default FacultyEventStudents;
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/FacultyEventStudents.css";

const FacultyEventStudents = () => {
  const { id } = useParams();
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
        <div className="students-count">
          {students.length} Students
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