import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ManageEvents.css";

const ManageEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5050/admin/event-requests")
      .then(res => res.json())
      .then(data => {
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

  return (
    <div className="manage-events-page">
      <h2 className="page-title">Events</h2>

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
                <td>Faculty</td>
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
    </div>
  );
};

export default ManageEvents;
