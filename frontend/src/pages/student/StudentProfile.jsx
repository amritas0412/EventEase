import "../../styles/StudentProfile.css";

const StudentProfile = () => {
  return (
    <div className="profile-page">
      <h2 className="profile-title">Student Profile</h2>

      {/* Profile Card */}
      <div className="profile-card">
        {/* Basic Info */}
        <div className="profile-section">
          <h3>Basic Information</h3>

          <div className="profile-row">
            <span>Student ID</span>
            <span>BTBTC23292</span>
          </div>

          <div className="profile-row">
            <span>Name</span>
            <span>Ritika Bhandari</span>
          </div>

          {/* ✅ NEW EMAIL ROW */}
          <div className="profile-row">
            <span>Email</span>
            <span>ritikabhandari@gmail.com</span>
          </div>

          <div className="profile-row">
            <span>Date of Birth</span>
            <span>12 August 2003</span>
          </div>

          <div className="profile-row">
            <span>Roll Number</span>
            <span>2316449</span>
          </div>
        </div>

        {/* Academic Info */}
        <div className="profile-section">
          <h3>Academic Details</h3>

          <div className="profile-row">
            <span>Department</span>
            <span>Computer Science</span>
          </div>

          <div className="profile-row">
            <span>Course</span>
            <span>B.Tech</span>
          </div>

          <div className="profile-row">
            <span>Year</span>
            <span>3rd Year</span>
          </div>

          <div className="profile-row">
            <span>Semester</span>
            <span>6</span>
          </div>

          <div className="profile-row">
            <span>CGPA</span>
            <span>8.6</span>
          </div>
        </div>

        {/* Skills (optional – commented) */}
        {/*
        <div className="profile-section">
          <h3>Skills</h3>

          <div className="skills-list">
            <span className="skill-badge">React</span>
            <span className="skill-badge">Java</span>
            <span className="skill-badge">SQL</span>
            <span className="skill-badge">HTML & CSS</span>
          </div>
        </div>
        */}
      </div>
    </div>
  );
};

export default StudentProfile;
