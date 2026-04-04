import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FacultyEvents.css"; //  FIXED PATH
import FacultyProfile from "./FacultyProfile";
import FacultySidebar from "../../component/FacultySidebar.jsx";

const FacultyEvents = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);
  const facultyId = localStorage.getItem("facultyId");
  const pastEvents = approvedEvents.filter(event => {
    const d = new Date(event.date);

    return (
      event.status === "approved" &&
      d < new Date() &&
      String(event.conductedBy?._id) === String(facultyId)
    );
  });
  useEffect(() => {
    fetch("http://localhost:5050/faculty/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApprovedEvents(data.events);
        }
      })
      .catch(err => console.error("FACULTY FETCH ERROR:", err));
  }, []);
  const fetchApproved = () => {
    fetch("http://localhost:5050/faculty/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApprovedEvents(data.events);
        }
      });
  };

  const today = new Date().toISOString().split("T")[0];
  const emptyForm = {
    eventName: "",
    date: "",
    startTime: "",
    endTime: "",
    venue: "",
    eligible: "",
    description: "",
    maxParticipants: ""
  };
  const upcomingEvents = approvedEvents.filter(
    (event) =>
      event.status?.toLowerCase() === "approved" &&
      event.date >= today
  );

  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.endTime <= formData.startTime) {
      alert("❌ End time must be after start time");
      return;
    }

    const max = Number(formData.maxParticipants);

    if (!Number.isInteger(max) || max <= 0) {
      alert("Maximum participants must be a positive integer.");
      return;
    }

    const email = localStorage.getItem("email");
    const payload = {
      ...formData,
      conductedBy: email   // ADD THIS
    };

    console.log("🚀 Sending to backend:", payload);

    try {
      const res = await fetch("http://localhost:5050/faculty/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("SERVER ERROR:", err);
        alert("❌ Failed to save event");
        return;
      }

      const data = await res.json();
      console.log("✅ Server:", data);


      // add locally AFTER DB success
      setEvents([
        ...events,
        {
          ...formData,
          id: Date.now(),
          status: "pending",
          registeredStudents: [],
        },
      ]);

      alert("📨 Event submitted successfully!");
      resetForm();

    } catch (err) {
      console.error("🔥 Network error:", err);
      alert("Backend not reachable");
    }
  };
  ;

  const approveEvent = (id) => {
    setEvents(
      events.map((ev) =>
        ev.id === id ? { ...ev, status: "approved" } : ev
      )
    );

    alert("✅ Event approved successfully");
  };


  const rejectEvent = (id) => {
    setEvents(
      events.map((ev) =>
        ev.id === id ? { ...ev, status: "rejected" } : ev
      )
    );

    alert("❌ Event rejected");
  };


  const handleEdit = (event) => {
    setFormData(event);
    setEditId(event.id);
    setShowForm(true);
  };

  const hasPendingRequests = events.some((e) => e.status === "pending");

  return (
    <div className="faculty-layout">
      <FacultySidebar />
      {/* Main Content */} <main className="main-content">
        <div className="top-bar-profile">
          <div
            className="profile-icon"
            onClick={() => setShowProfile(!showProfile)}
          >
            👤
          </div>

          {showProfile && (
            <div className="profile-dropdown">

              <FacultyProfile events={pastEvents} />

              <button
                className="profile-btn"
                onClick={() => navigate("/faculty/calendar")}
              >
                📅 View Calendar
              </button>

              <button
                className="profile-btn logout"
                onClick={() => {
                  localStorage.clear();
                  navigate("/login", { replace: true });
                }}
              >
                🚪 Logout
              </button>

            </div>
          )}
        </div>
        <div className="page-header">
          <h2>Events</h2>
          <p>Create, edit, and manage department events.</p>
        </div>
        <button className="add-event-btn"
          onClick={() => setShowForm(true)} > ➕ Add Event
        </button>

        {showForm && (
          <form className="event-form" onSubmit={handleSubmit}>
            <h3>{editId ? "Edit Event" : "Add New Event"}</h3>

            <input
              name="eventName"
              placeholder="Event Name"
              required
              value={formData.eventName}
              onChange={handleChange}
            />

            <input
              type="date"
              name="date"
              min={today}
              required
              value={formData.date}
              onChange={handleChange}
            />

            <div className="time-row">
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />

              <span className="to-text">to</span>

              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>

            <input
              name="venue"
              placeholder="Venue"
              required
              value={formData.venue}
              onChange={handleChange}
            />

            <input
              name="eligible"
              placeholder="Eligible Branch / Year"
              required
              value={formData.eligible}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Event Description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
            />
            <input
              type="number"
              name="maxParticipants"
              placeholder="Max Participants"
              min="1"
              step="1"
              value={formData.maxParticipants}
              onChange={(e) => {
                const value = e.target.value;

                // allow only positive integers or empty
                if (value === "" || /^[1-9][0-9]*$/.test(value)) {
                  setFormData({ ...formData, maxParticipants: value });
                }
              }}
            />

            <div className="form-actions">
              <button type="submit">📨 Submit</button>
              <button type="button" onClick={resetForm}>
                ❌ Cancel
              </button>
            </div>
          </form>
        )}

        {/* Approved Events */}
        <div className="events-box">
          <h3>Upcoming Events</h3>

          {approvedEvents.length === 0 ? (
            <p>No approved events yet</p>
          ) : (
            upcomingEvents.map(event => (
              <div key={event._id} className="event-card">
                <h4>{event.eventName}</h4>
                <p>Date: {event.date}</p>
                <p>Venue: {event.venue}</p>
                <p>Time: {event.startTime} - {event.endTime}</p>
              </div>
            ))
          )}
          {/* Pending Requests */}
          {hasPendingRequests && (
            <div className="events-box">
              <h3>Request Pending</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FacultyEvents;
