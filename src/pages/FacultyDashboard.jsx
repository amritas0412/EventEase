import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FacultyDashboard.css';

const FacultyDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate(); // ✅ for navigation

  const handleLogout = () => {
    // Clear auth tokens if needed
    navigate('/login'); // ✅ redirect to login page
  };

  return (
    <div className="faculty-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="brand">EventEase</h2>

        <ul>
          <li className="active">📊 Dashboard</li>
          <li onClick={() => navigate('/faculty-events')}>
            📅 Events
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* Top Right Profile */}
        <div className="top-bar-profile">
          <div
            className="profile-icon"
            onClick={() => setShowProfile(!showProfile)}
          >
            👤
          </div>

          {showProfile && (
            <div className="profile-dropdown">
              <p className="profile-name">Faculty Name</p>
              <p className="profile-email">faculty@email.com</p>

              <p className="profile-stat">
                Total Events Conducted: <strong>—</strong>
              </p>

              <button className="profile-btn">
                📅 View Calendar
              </button>

              <button
                className="profile-btn logout"
                onClick={handleLogout}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>

        {/* Department Events Panel */} <section className="panel"> <div className="panel-header"> <h3>🏫 Department Events</h3> <input type="text" className="search-input" placeholder="Search Events" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} /> </div> <div className="panel-grid"> {/* Dynamic cards from backend */} <div className="event-card dashboard-card"> <h4>Event Name</h4> <p>Date</p> <p>Time</p> <p>Venue</p> <p className="muted-text">Conducted by Faculty</p> </div> <div className="event-card dashboard-card empty-card"> <p>Department events will appear here</p> </div> </div> </section> {/* Faculty Event History Panel */} <section className="panel"> <div className="panel-header"> <h3>🕘 Your Event History</h3> </div> <div className="panel-grid"> {/* Dynamic cards from backend */} <div className="event-card dashboard-card"> <h4>Event Name</h4> <p>Date</p> <p>Feedback</p> <p className="muted-text">Total Registrations: --</p> </div> <div className="event-card dashboard-card empty-card"> <p>Your conducted events will appear here</p> </div> </div> </section>

      </main>
    </div>
  );
};

export default FacultyDashboard;