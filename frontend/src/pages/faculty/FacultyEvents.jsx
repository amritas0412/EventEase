import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FacultyEvents.css"; //  FIXED PATH

const FacultyEvents = () => {
  const navigate = useNavigate();
  const [approvedEvents, setApprovedEvents] = useState([]);

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
  };

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

    const payload = { ...formData };

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
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="brand">EventEase</h2>
        <ul>
          <li
            onClick={() => navigate("/faculty/dashboard")}
            style={{ cursor: "pointer" }}
          >
            📊 Dashboard
          </li>
          <li className="active">
            📅 Events <span className="badge">{approvedEvents.length}</span>

          </li>
        </ul>
      </aside>

      {/* Main Content */} <main className="main-content"> <div className="page-header"> <h2>Events</h2> <p>Create, edit, and manage department events.</p> </div> <button className="add-event-btn" onClick={() => setShowForm(true)} > ➕ Add Event </button>

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
            approvedEvents.map(event => (
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
