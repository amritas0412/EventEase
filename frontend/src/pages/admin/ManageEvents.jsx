import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/ManageEvents.css";

const ManageEvents = () => {
  const navigate = useNavigate();

  // ✅ EVENTS AS STATE (IMPORTANT)
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "AI Workshop",
      organizer: "Prof. Navin Mathur",
      date: "12 Feb 2026",
      status: "Pending",
    },
    {
      id: 2,
      name: "Web Development Seminar",
      organizer: "Rajesh Kumar",
      date: "20 Feb 2026",
      status: "Pending",
    },
  ]);

  // ✅ APPROVE HANDLER
  const approveEvent = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id
          ? { ...event, status: "Approved" }
          : event
      )
    );
  };

  // ✅ REJECT HANDLER
  const rejectEvent = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id
          ? { ...event, status: "Rejected" }
          : event
      )
    );
  };

  return (
    <div className="manage-events-page">
      <h2 className="page-title">Manage Events</h2>

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
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.organizer}</td>
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
                  {event.status === "Pending" ? (
                    <>
                      <button
                        className="approve-btn"
                        onClick={() => approveEvent(event.id)}
                      >
                        Approve
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => rejectEvent(event.id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span>-</span>
                  )}
                </td>

                {/* DETAILS */}
                <td>
                  <button
                    className="details-btn"
                    onClick={() =>
                      navigate(`/admin/events/${event.id}`)
                    }
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
