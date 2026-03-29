import React, { useState, useEffect } from "react";
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
  const [prevPlacements, setPrevPlacements] = useState([]);

  const fetchPlacements = async () => {
    try {
      const res = await fetch("http://localhost:5050/placement/all");
      const data = await res.json();

      if (data.success) {
        // Detect newly rejected placements
        const newlyRejected = prevPlacements.filter(
          p => p.status === "pending" && !data.placements.some(np => np._id === p._id)
        );

        newlyRejected.forEach(r => {
          alert(`❌ Request for ${r.name} is rejected`);
        });
        setEvents(data.placements);
        setPrevPlacements(data.placements);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlacements();

     // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchPlacements();
    }, 5000);

    return () => clearInterval(interval); // cleanup
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData(emptyForm);
    setEditId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.endtime <= formData.time) {
      alert("❌ End time must be after start time");
      return;
    }

    if (parseInt(formData.stipend, 10) < 0) {
      alert("❌ Stipend cannot be negative");
      return;
    }

    try {
      let res;

      // ✏ EDIT MODE
      if (editId) {
        res = await fetch(`http://localhost:5050/placement/${editId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      // ➕ CREATE MODE
      else {
        res = await fetch("http://localhost:5050/placement/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      const data = await res.json();

      if (data.success) {
        alert(editId ? "✏ Updated & sent for approval" : "📨 Placement sent for approval");
        resetForm();
        fetchPlacements();
      } else {
        alert("❌ Failed");
      }

    } catch (err) {
      console.error(err);
    }
  };
    
  const approvePlacement = async (id) => {
    await fetch(`http://localhost:5050/placement/${id}/approve`, {
      method: "PATCH",
    });

    alert("✅ Approved");
    fetchPlacements();
  };

  const rejectPlacement = async (placement) => {
    try {
      const res = await fetch(`http://localhost:5050/placement/${placement._id}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        // Remove from current events immediately
        setEvents(prev => prev.filter(ev => ev._id !== placement._id));

        // Show alert with company name
        alert(`❌ Request for ${placement.name} is rejected`);

        // Optionally refresh list from backend
        fetchPlacements();
      } else {
        alert("❌ Failed to reject");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Something went wrong");
    }
  };


  const handleEdit = (event) => {
    setFormData(event);
    setEditId(event._id);
    setShowForm(true);
  };

  const pendingPlacements = events.filter(ev => ev.status === "pending");
  const approvedPlacements = events.filter(ev => ev.status === "approved" && ev.date && ev.date >= today);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const handleViewStudents = async (placementId) => {
    try {
      setLoadingStudents(true);

      const res = await fetch(
        `http://localhost:5050/placement/${placementId}/registrations`
      );
      const data = await res.json();

      setSelectedStudents(data.registrations || []);
      setShowModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const formatDescription = (text = "") => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split("\n").map((line, i) => (
      <span key={i}>
        {line.split(urlRegex).map((part, j) =>
          urlRegex.test(part) ? (
            <a
              key={j}
              href={part}
              target="_blank"
              rel="noopener noreferrer"
            >
              {part}
            </a>
          ) : (
            part
          )
        )}
        <br />
      </span>
    ));
  };

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
            📅 Placements <span className="badge">{approvedPlacements.length}</span>
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
                value={formData.time}
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
            <input type="number" name="stipend" placeholder="Stipend per Month (₹)" min="0" step="0.01" required value={formData.stipend} onChange={handleChange} />

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
            <div key={event._id} className="event-card">
              <h4>{event.name}</h4>
              <p>💼 {event.jobrole}</p>
              <p>
                📅 {" "}
                  {new Date(event.date).toLocaleDateString("en-GB"/*, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }*/)}{" "}
                ⏰ {event.time} to {event.endtime}
              </p>

              <p>🏢 {event.venue}</p>
              <p>🌍 {event.location}</p>
              <p>🎓 {event.audience}</p>
              <p>💰 ₹{event.stipend} / month</p>
              {event.description && (
                <p className="description-text">
                  {formatDescription(event.description)}
                </p>
              )}
        

              {/* Registration Info */}
              <div className="registration-info">
                <p>📝 Registered Students: {event.registrations?.length || 0}</p>
                <button
                  className="view-btn"
                  onClick={() => handleViewStudents(event._id)}
                >
                  👥 View Students
                </button>
              </div>

              <div className="action-row">
                <button
                  className="edit-btn"
                  onClick={() => handleEdit(event)}
                >
                  ✏ Edit
                </button>
              </div>
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
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <div 
            className="popup-backdrop"
            onClick={() => setShowModal(false)}
          >
            <div 
              className="popup-card"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="popup-header">
                <h3>Registered Students</h3>
                <button
                  className="popup-close"
                  onClick={() => setShowModal(false)}
                >
                  ✖
                </button>
              </div>

              {loadingStudents ? (
                <p>Loading...</p>
              ) : selectedStudents.length === 0 ? (
                <p>No students registered</p>
              ) : (
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudents.map((s, index) => (
                      <tr key={index}>
                        <td>{s.name}</td>
                        <td>{s.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Placements;
