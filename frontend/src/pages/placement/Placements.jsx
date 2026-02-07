import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Placements.css"; // ✅ FIXED PATH

const Placements = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const emptyForm = {
    name: "",
    jobrole: "",
    date: "",
    time: "",
    endtime: "", 
    venue: "",
    location: "",
    audience: "",
    stipend: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.endtime <= formData.startTime) {
  alert("❌ End time must be after start time");
  return;
}


    if (parseInt(formData.stipend, 10) < 0) {
      alert("❌ Stipend cannot be negative");
      return;
    }

    if (editId) {
      setEvents(events.map(ev =>
        ev.id === editId
          ? { ...formData, id: editId, status: "pending", registrations: ev.registrations || [] }
          : ev
      ));
      alert("✏ Placement updated and sent for re-approval");
    } else {
      setEvents([
        ...events,
        { ...formData, id: Date.now(), status: "pending", registrations: [] },
      ]);
      alert("📨 Placement request sent to admin for approval");
    }

    resetForm();
  };

  const approvePlacement = (id) =>{
    setEvents(events.map(ev =>
      ev.id === id ? { ...ev, status: "approved" } : ev
    ));
     alert("✅ Request approved successfully");
  };

  const rejectPlacement = (id) =>{
    setEvents(events.map(ev =>
      ev.id === id ? { ...ev, status: "rejected" } : ev
    ));
    alert("❌ Request rejected");
  };
  const handleEdit = (event) => {
    setFormData(event);
    setEditId(event.id);
    setShowForm(true);
  };

  const pendingPlacements = events.filter(ev => ev.status === "pending");
  const approvedPlacements = events.filter(ev => ev.status === "approved");

  return (
    <div className="placement-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="brand">EventEase</h2>
        <ul>
          <li
            onClick={() => navigate("/placement/dashboard")}
            style={{ cursor: "pointer" }}
          >
            📊 Dashboard
          </li>
          <li className="active">
            📅 Placements <span className="badge">{events.length}</span>
          </li>
        </ul>
      </aside>

      {/* Main */}
      <main className="main-content">
        <div className="page-header">
          <h2>Placements</h2>
          <p>Create and manage placement drives</p>
        </div>

        <button className="add-event-btn" onClick={() => setShowForm(true)}>
          ➕ Add Placement
        </button>

        {showForm && (
          <form className="event-form" onSubmit={handleSubmit}>
            <h3>{editId ? "Edit Placement" : "Add Placement"}</h3>

            <input name="name" placeholder="Company Name" required value={formData.name} onChange={handleChange} />
            <input name="jobrole" placeholder="Job Role" required value={formData.jobrole} onChange={handleChange} />
            <input type="date" name="date" min={today} required value={formData.date} onChange={handleChange} />
            <div className="time-row">
  <input
    type="time"
    name="time"
    value={formData.startTime}
    onChange={handleChange}
    required
  />

  <span className="to-text">to</span>

  <input
    type="time"
    name="endtime"
    value={formData.endtime}
    onChange={handleChange}
    required
  />
</div>

            <input name="venue" placeholder="Event Venue" required value={formData.venue} onChange={handleChange} />
            <input name="location" placeholder="Company Location" required value={formData.location} onChange={handleChange} />
            <input name="audience" placeholder="Eligible Branch / Year" required value={formData.audience} onChange={handleChange} />
            <input type="number" name="stipend" placeholder="Stipend per Month (₹)" min="0" required value={formData.stipend} onChange={handleChange} />

            <textarea name="description" placeholder="Company Description" rows="5" value={formData.description} onChange={handleChange} />

            <div className="form-actions">
              <button type="submit">📨 Submit</button>
              <button type="button" onClick={resetForm}>❌ Cancel</button>
            </div>
          </form>
        )}

        {/* Approved */}
        <div className="events-box">
          <h3>Upcoming Placements</h3>

          {approvedPlacements.length === 0 && <p>No approved placement drives yet</p>}

          {approvedPlacements.map(event => (
            <div key={event.id} className="event-card">
              <h4>{event.name}</h4>
              <p>💼 {event.jobrole}</p>
              <p>
  📅 {event.date} ⏰ {event.time} to {event.endtime}
</p>

              <p>🏢 {event.venue}</p>
              <p>🌍 {event.location}</p>
              <p>🎓 {event.audience}</p>
              <p>💰 ₹{event.stipend} / month</p>
              {event.description && <p>{event.description}</p>}

{/*  Registration count */}
  <p className="registration-count">
    📝 Registrations: {event.registrations.length}
  </p>

  {/*  Registered student details */}
  {event.registrations.length >= 0 && (
    <div className="registered-students">
      <h5>Registered Students</h5>

      {event.registrations.map((student, index) => (
        <div key={index} className="student-row">
          <span>{student.name}</span>
          <span>{student.email}</span>
        </div>
      ))}
    </div>
  )}

              <button onClick={() => handleEdit(event)}>✏ Edit</button>
            </div>
          ))}
        </div>

        {/* Pending */}
        {pendingPlacements.length > 0 && (
          <div className="events-box">
            <h3>Request Processing</h3>

            {pendingPlacements.map(event => (
              <div key={event.id} className="event-card pending">
                <h4>{event.name}</h4>
                <p>{event.jobrole}</p>
                <div className="action-buttons">
                  <button onClick={() => approvePlacement(event.id)}>✅ Approve</button>
                  <button onClick={() => rejectPlacement(event.id)}>❌ Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Placements;
