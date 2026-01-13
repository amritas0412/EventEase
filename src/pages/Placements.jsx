import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Placements.css';

const Placements = () => {
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const emptyForm = {
    name: '',
    jobrole: '',
    date: '',
    time: '',
    venue: '',
    location: '',
    audience: '',
    stipend: '',
    description: '',
  };

  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (parseInt(formData.stipend, 10) < 0) {
      alert('❌ Stipend cannot be negative');
      return;
    }

    if (editId) {
      setEvents(events.map(ev =>
        ev.id === editId
          ? {
              ...formData,
              id: editId,
              status: 'pending',
              registrations: ev.registrations || []
            }
          : ev
      ));
      alert('✏ Placement updated and sent for re-approval');
    } else {
      setEvents([
        ...events,
        {
          ...formData,
          id: Date.now(),
          status: 'pending',
          registrations: [] // 🔗 backend will fill
        },
      ]);
      alert('📨 Placement request sent to admin for approval');
    }

    resetForm();
  };

  const approvePlacement = (id) => {
    setEvents(events.map(ev =>
      ev.id === id ? { ...ev, status: 'approved' } : ev
    ));
    alert('✅ Placement approved and added to Upcoming Placements');
  };

  const rejectPlacement = (id) => {
    setEvents(events.map(ev =>
      ev.id === id ? { ...ev, status: 'rejected' } : ev
    ));
    alert('❌ Placement request rejected');
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditId(event.id);
    setShowForm(true);
  };

  const pendingPlacements = events.filter(ev => ev.status === 'pending');
  const approvedPlacements = events.filter(ev => ev.status === 'approved');

  return (
    <div className="placement-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="brand">EventEase</h2>
        <ul>
          <li onClick={() => navigate('/placement-dashboard')}>
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
            <h3>{editId ? 'Edit Placement' : 'Add Placement'}</h3>

            <input name="name" placeholder="Company Name" required value={formData.name} onChange={handleChange} />
            <input name="jobrole" placeholder="Job Role" required value={formData.jobrole} onChange={handleChange} />
            <input type="date" name="date" min={today} required value={formData.date} onChange={handleChange} />
            <input type="time" name="time" required value={formData.time} onChange={handleChange} />
            <input name="venue" placeholder="Event Venue" required value={formData.venue} onChange={handleChange} />
            <input name="location" placeholder="Company Location" required value={formData.location} onChange={handleChange} />
            <input name="audience" placeholder="Eligible Branch / Year" required value={formData.audience} onChange={handleChange} />

            <input
              type="number"
              name="stipend"
              placeholder="Stipend per Month (₹)"
              value={formData.stipend}
              min="0"
              step="1"
              required
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^(0|[1-9]\d*)$/.test(value)) {
                  setFormData({ ...formData, stipend: value });
                }
              }}
            />

            <textarea
              name="description"
              placeholder="Company Description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
            />

            <div className="form-actions">
              <button type="submit" className="submit-btn">📨 Submit</button>
              <button type="button" className="cancel-btn" onClick={resetForm}>❌ Cancel</button>
            </div>
          </form>
        )}

        {/* Upcoming Placements */}
        <div className="events-box">
          <h3>Upcoming Placements</h3>

          {approvedPlacements.length === 0 && (
            <p>No approved placement drives yet</p>
          )}

          {approvedPlacements.map(event => (
            <div key={event.id} className="event-card">
              <h4>{event.name}</h4>
              <p>💼 {event.jobrole}</p>
              <p>📅 {event.date} ⏰ {event.time}</p>
              <p>🏢 <strong>Venue:</strong> {event.venue}</p>
              <p>🌍 <strong>Company Location:</strong> {event.location}</p>
              <p>🎓 {event.audience}</p>
              <p>💰 <strong>Stipend:</strong> ₹{event.stipend} / month</p>

              {/* 🔗 Registration Section (Backend Ready) */}
              <div className="registration-section">
                <h4>Registration Details</h4>
                <p>
                  <strong>Total Registered Students:</strong>{' '}
                  {event.registrations?.length || 0}
                </p>

                {event.registrations?.length === 0 && (
                  <p className="muted-text">No registrations yet</p>
                )}
              </div>

              <button onClick={() => handleEdit(event)}>✏ Edit</button>
            </div>
          ))}
        </div>

        {/* Request Processing */}
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
