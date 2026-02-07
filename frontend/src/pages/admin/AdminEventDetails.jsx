// import { useParams, useNavigate } from "react-router-dom";
// import "../../styles/AdminEventDetails.css";

// const AdminEventDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   // Dummy event data (later connect to backend)
//   const event = {
//     id,
//     name: "AI Workshop 2026",
//     date: "12 Feb 2026",
//     time: "10:00 AM - 4:00 PM",
//     venue: "Main Seminar Hall",
//     organizer: "Prof. Navin Mathur",
//     eligibleBranch: "CSE, IT, AI",
//     eligibleYear: "2nd, 3rd, 4th Year",
//     description:
//       "This workshop focuses on Artificial Intelligence fundamentals, hands-on ML models, and industry use cases.",
//   };

//   return (
//     <div className="admin-event-details-page">
//       <div className="details-header">
//         <h2>{event.name}</h2>

//         <button className="back-btn" onClick={() => navigate(-1)}>
//           ← Back
//         </button>
//       </div>

//       <div className="details-card">
//         <p><strong>Organizer:</strong> {event.organizer}</p>
//         <p><strong>Date:</strong> {event.date}</p>
//         <p><strong>Time:</strong> {event.time}</p>
//         <p><strong>Venue:</strong> {event.venue}</p>
//         <p><strong>Eligible Branch:</strong> {event.eligibleBranch}</p>
//         <p><strong>Eligible Year:</strong> {event.eligibleYear}</p>

//         <div className="description-box">
//           <strong>Description:</strong>
//           <p>{event.description}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminEventDetails;
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../styles/AdminEventDetails.css";

const AdminEventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5050/admin/events/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvent(data.event);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("FETCH DETAILS ERROR:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;

  if (!event) return <p style={{ padding: "40px" }}>Event not found.</p>;

  return (
    <div className="admin-event-details-page">
      <div className="details-header">
        <h2>{event.eventName}</h2>

        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="details-card">
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Eligible:</strong> {event.eligible}</p>

        <div className="description-box">
          <strong>Description:</strong>
          <p>{event.description}</p>
        </div>

        <p><strong>Status:</strong> {event.status}</p>
      </div>
    </div>
  );
};

export default AdminEventDetails;

