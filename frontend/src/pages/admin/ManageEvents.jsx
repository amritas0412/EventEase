import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ManageEvents.css";

const ManageEvents = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5050/admin/event-requests")
      .then(res => res.json())
      .then(data => {
        console.log("ADMIN EVENTS:", data.events);
        if (data.success) {
          setEvents(data.events);
        }
      })
      .catch(err => console.error("FETCH ERROR:", err));
  }, []);


  const approveEvent = async (id) => {
    await fetch(`http://localhost:5050/admin/events/${id}/approve`, {
      method: "PATCH",
    });

    setEvents(prev => prev.filter(ev => ev._id !== id));
  };

  const rejectEvent = async (id) => {
    await fetch(`http://localhost:5050/admin/events/${id}/reject`, {
      method: "PATCH",
    });

    setEvents(prev => prev.filter(ev => ev._id !== id));
  };
  const [approvedEvents, setApprovedEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/admin/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setApprovedEvents(data.events);
        }
      });
  }, []);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const pastEvents = approvedEvents.filter(event => {
    const eventDate = new Date(event.date);
    eventDate.setHours(0, 0, 0, 0);

    return (
      event.status === "approved" &&
      eventDate < today
    );
  });
  return (
    <div className="manage-events-page">
      <h2 className="page-title">Events</h2>
      <div className="top-bar-profile">
        <div className="profile-container">
          <div
            className="profile-icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
          >
            👤
          </div>

          {showDropdown && (
            <div className="profile-dropdown">
              <p className="profile-email">
                {localStorage.getItem("email")}
              </p>
              <button className="logout-btn" onClick={() => {
                localStorage.clear();
                navigate("/login", { replace: true });
              }}>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>

      <div className="table-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Organizer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>


          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.eventName}</td>
                <td>{event.conductedBy?.name}</td>
                <td>{event.date}</td>


                {/* STATUS */}
                <td>
                  <span
                    className={`status ${event.status.toLowerCase()}`}
                  >
                    {event.status}
                  </span>
                </td>

                {/* ACTION BUTTONS */}
                <td>
                  {event.status === "pending" ? (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => approveEvent(event._id)}
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => rejectEvent(event._id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </td>

                <td>
                  <button
                    className="details-btn"
                    onClick={() => navigate(`/admin/events/${event._id}`)}
                  >
                    See Details
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* ===== PAST EVENTS ===== */}
      <div className="admin-section">
        <h3>Past Events Performance</h3>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Organizer</th>
              <th>Date</th>
              <th>Total Registrations</th>
              <th>Avg Rating</th>
              <th>Reviews</th>
              <th>Performance</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {pastEvents.length === 0 ? (
              <tr>
                <td colSpan="8">No past events available</td>
              </tr>
            ) : (
              pastEvents.map(event => {
                const performance =
                  event.averageRating
                    ? ((event.averageRating / 5) * 100).toFixed(0)
                    : 0;
                return (
                  <tr key={event._id}>
                    <td>{event.eventName}</td>
                    <td>{event.conductedBy?.name}</td>
                    <td>{event.date}</td>
                    <td>{event.registeredCount || 0}</td>
                    <td className="rating-cell">
                      {event.feedbackCount > 0
                        ? <>
                          <span className="star">⭐</span>
                          <strong>{event.averageRating.toFixed(1)}</strong>
                        </>
                        : "—"}
                    </td>
                    <td>{event.feedbackCount || 0}</td>
                    {/* <td>{performance}% Feedback</td> */}
                    <td>
                      <div className="performance-wrapper">
                        <div
                          className="performance-bar"
                          style={{ width: `${performance}%` }}
                        ></div>
                        <span>{performance}%</span>
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          navigate(`/admin/events/${event._id}`)
                        }
                      >
                        See Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default ManageEvents;
