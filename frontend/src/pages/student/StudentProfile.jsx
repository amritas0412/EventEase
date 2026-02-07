import { useEffect, useState } from "react";
import "../../styles/StudentProfile.css";

const STUDENTS = {
  "btbtc23271_kumari@banasthali.in": {
    studentId: "BTBTC23271",
    name: "Kumari Amrita Singh",
    email: "btbtc23271_kumari@banasthali.in",
    dob: "14.08.2005",
    roll: "2316448",
    department: "Computer Science",
    course: "B Tech",
    year: "3rd Year",
    semester: "6",
    cgpa: "5",
  },

  "btbtc23292_kumari@banasthali.in": {
    studentId: "BTBTC23292",
    name: "Kumari Samvedna",
    email: "btbtc23292_kumari@banasthali.in",
    dob: "11.09.2005",
    roll: "2316449",
    department: "Computer Science",
    course: "B Tech",
    year: "3rd Year",
    semester: "6",
    cgpa: "5",
  },

  "btbtc23237_kumari@banasthali.in": {
    studentId: "BTBTC23237",
    name: "Palak Gupta",
    email: "btbtc23237_palak@banasthali.in",
    dob: "13.04.2005",
    roll: "2316494",
    department: "Computer Science",
    course: "B Tech",
    year: "3rd Year",
    semester: "6",
    cgpa: "5",
  },

  "btbtc23078_neetika@banasthali.in": {
    studentId: "BTBTC23078",
    name: "Neetika Sethi",
    email: "btbtc23078_neetika@banasthali.in",
    dob: "13.04.2005",
    roll: "2316078",
    department: "Computer Science",
    course: "B Tech",
    year: "3rd Year",
    semester: "6",
    cgpa: "5",
  },
};

const StudentProfile = () => {
  const [student, setStudent] = useState(null);

  useEffect(() => {
    // 👇 email saved during login
    const email = localStorage.getItem("email");

    if (email && STUDENTS[email]) {
      setStudent(STUDENTS[email]);
    }
  }, []);

  if (!student) {
    return <h2 className="loading-text">Loading profile...</h2>;
  }

  return (
    <div className="profile-page">
      <h2 className="profile-title">Student Profile</h2>

      <div className="profile-card">
        {/* ================= BASIC INFO ================= */}
        <div className="profile-section">
          <h3>Basic Information</h3>

          <div className="profile-row">
            <span>Student ID</span>
            <span>{student.studentId}</span>
          </div>

          <div className="profile-row">
            <span>Name</span>
            <span>{student.name}</span>
          </div>

          <div className="profile-row">
            <span>Email</span>
            <span>{student.email}</span>
          </div>

          <div className="profile-row">
            <span>Date of Birth</span>
            <span>{student.dob}</span>
          </div>

          <div className="profile-row">
            <span>Roll Number</span>
            <span>{student.roll}</span>
          </div>
        </div>

        {/* ================= ACADEMIC ================= */}
        <div className="profile-section">
          <h3>Academic Details</h3>

          <div className="profile-row">
            <span>Department</span>
            <span>{student.department}</span>
          </div>

          <div className="profile-row">
            <span>Course</span>
            <span>{student.course}</span>
          </div>

          <div className="profile-row">
            <span>Year</span>
            <span>{student.year}</span>
          </div>

          <div className="profile-row">
            <span>Semester</span>
            <span>{student.semester}</span>
          </div>

          <div className="profile-row">
            <span>CGPA</span>
            <span>{student.cgpa}</span>
          </div>
        </div>

        {/* ================= ACTION ================= */}
        <div className="profile-actions">
          <button className="update-profile-btn">
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
