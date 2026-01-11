import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FacultyEvents.css';

const FacultyEvents = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const emptyForm = {
    name: '',
    date: '',
    time: '',
    venue: '',
    audience: '',
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

    if (editId) {
      setEvents(events.map(ev =>
        ev.id === editId
          ? { ...formData, id: editId, status: 'pending', registeredStudents: ev.registeredStudents || [] }
          : ev
      ));
      alert('✏ Event updated and sent for approval');
    } else {
      setEvents([
        ...events,
        {
          ...formData,
          id: Date.now(),
          status: 'pending',
          registeredStudents: []
        }
      ]);
      alert('📨 Event request sent');
    }

    resetForm();
  };

  const approveEvent = (id) => {
    setEvents(events.map(ev =>
      ev.id === id ? { ...ev, status: 'approved' } : ev
    ));
    alert('✅ Your event has been approved');
  };

  const rejectEvent = (id) => {
    setEvents(events.map(ev =>
      ev.id === id ? { ...ev, status: 'rejected' } : ev
    ));
    alert('❌ Your event has been rejected');
  };

  const handleEdit = (event) => {
    setFormData(event);
    setEditId(event.id);
    setShowForm(true);
  };

  const hasPendingRequests = events.some(e => e.status === 'pending');

  return (
    <div className="faculty-layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="brand">EventEase</h2>
        <ul>
          <li onClick={() => navigate('/faculty-dashboard')} style={{ cursor: 'pointer' }}>
            📊 Dashboard
          </li>
          <li className="active">
            📅 Events <span className="badge">{events.length}</span>
          </li>
        </ul>
      
      </aside>

      {/* Main Content */}
      <main className="main-content">

        <div className="page-header">
          <h2>Events</h2>
          <p>Create, edit, and manage department events.</p>
        </div>

        <button className="add-event-btn" onClick={() => setShowForm(true)}>
          ➕ Add Event
        </button>

        {/* Event Form */}
        {showForm && (
          <form className="event-form" onSubmit={handleSubmit}>
            <h3>{editId ? 'Edit Event' : 'Add New Event'}</h3>

            <input
              name="name"
              placeholder="Event Name"
              required
              value={formData.name}
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

            <input
              type="time"
              name="time"
              required
              value={formData.time}
              onChange={handleChange}
            />

            <input
              name="venue"
              placeholder="Venue"
              required
              value={formData.venue}
              onChange={handleChange}
            />

            <input
              name="audience"
              placeholder="Eligible Branch / Year"
              required
              value={formData.audience}
              onChange={handleChange}
            />

            <textarea
              name="description"
              placeholder="Event Description"
              rows="6"
              style={{ width: '100%' }}
              value={formData.description}
              onChange={handleChange}
            />

            <div className="form-actions">
              <button type="submit">📨 Submit</button>
              <button type="button" onClick={resetForm}>❌ Cancel</button>
            </div>
          </form>
        )}

        <div style={{ marginTop: '30px' }}></div>

        {/* Upcoming Events */}
        <div className="events-box">
          <h3>Upcoming Events</h3>

          {events.filter(e => e.status === 'approved').length === 0 && (
            <p>No approved events yet</p>
          )}

          {events.filter(e => e.status === 'approved').map(event => (
            <div key={event.id} className="event-card">

              <h4>{event.name}</h4>
              <p>📅 {event.date} ⏰ {event.time}</p>
              <p>📍 {event.venue}</p>
              <p>👥 {event.audience}</p>

              {event.description && (
                <p><strong>Description:</strong> {event.description}</p>
              )}

              {/* Registration Details */}
              <div className="registration-section">
                <h4>Registration Details</h4>

                <p>
                  <strong>Total Registered Students:</strong>{' '}
                  {event.registeredStudents?.length || 0}
                </p>

                {event.registeredStudents && event.registeredStudents.length > 0 ? (
                  <ul className="registration-list">
                    {event.registeredStudents.map((student, index) => (
                      <li key={index}>
                        {student.name} — {student.course}, {student.year}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No registrations yet</p>
                )}
              </div>

              <button onClick={() => handleEdit(event)}>✏ Edit</button>
            </div>
          ))}
        </div>

        {/* Request Processing */}
        {hasPendingRequests && (
          <div className="events-box">
            <h3>Request Processing</h3>

            {events.filter(e => e.status === 'pending').map(event => (
              <div key={event.id} className="event-card pending">
                <h4>{event.name}</h4>
                <div className="action-buttons">
  <button onClick={() => approveEvent(event.id)}>
    ✅ Approve
  </button>

  <button onClick={() => rejectEvent(event.id)}>
    ❌ Reject
  </button>
</div>

              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default FacultyEvents;