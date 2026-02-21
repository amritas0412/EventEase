// import { useParams } from "react-router-dom";
// import { useState, useEffect } from "react";
// import "../../styles/StudentEventDetails.css";

// const StudentEventDetails = () => {
//   const { id } = useParams();

//   const [event, setEvent] = useState(null);
//   const [registered, setRegistered] = useState(false);

//   // ⭐ Feedback state
//   const [rating, setRating] = useState(0);
//   const [feedback, setFeedback] = useState("");
//   const [submitted, setSubmitted] = useState(false);
//   const studentId = localStorage.getItem("studentId");

//   // ✅ FETCH EVENT BY ID
//   useEffect(() => {
//     fetch(`http://localhost:5050/student/events/${id}`)
//       .then(res => res.json())
//       .then(data => {
//         if (data.success) {
//           setEvent(data.event);
//         }
//       })
//       .catch(err => console.error("DETAIL FETCH ERROR:", err));
//   }, [id]);


//   useEffect(() => {
//     if (!event) return;

//     fetch(
//       `http://localhost:5050/student/registration/check?studentId=${studentId}&eventId=${event._id}`
//     )
//       .then(res => res.json())
//       .then(data => {
//         if (data.registered) {
//           setRegistered(true);
//         }
//       });
//   }, [event]);
//   // ⏳ Loading state
//   if (!event) {
//     return <p className="loading-text">Loading event...</p>;
//   }
//   const handleRegister = async () => {
//     try {
//       const res = await fetch("http://localhost:5050/student/register/event", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           studentId,
//           eventId: event._id
//         })
//       });

//       const data = await res.json();

//       if (data.success) {
//         alert("Registered Successfully");
//         setRegistered(true);
//       } else {
//         alert(data.message || "Something went wrong");
//       }

//     } catch (err) {
//       console.error("REGISTER ERROR:", err);
//     }
//   };
//   // ⭐ FEEDBACK SUBMIT
//   const handleSubmitFeedback = () => {
//     if (rating === 0) {
//       alert("Please select a rating");
//       return;
//     }

//     console.log({
//       eventId: id,
//       rating,
//       feedback,
//     });

//     setSubmitted(true);
//   };
//   const today = new Date();
//   const eventDate = new Date(event.date + "T23:59:59"); // End of event day

//   const isEventOver = eventDate < today;

//   return (
//     <div className="event-details-page">
//       <h2 className="event-title">{event.eventName}</h2>

//       <div className="event-details-card">
//         <p><strong>Description:</strong> {event.description}</p>
//         <p><strong>Organizer:</strong> {event.conductedBy?.name || "Unknown"}</p>
//         <p><strong>Date:</strong> {event.date}</p>
//         <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
//         <p><strong>Location:</strong> {event.venue}</p>

//         <p>
//           <strong>Status:</strong>{" "}
//           {registered ? "Registered" : "Not Registered"}
//         </p>

//         {/* ✅ REGISTER BUTTON */}
//         <button
//           className={registered ? "registered-btn" : "register-btn"}
//           onClick={handleRegister}
//           disabled={registered}
//         >
//           {registered ? "Registered" : "Register"}
//         </button>

//       </div>
//       {/* ===== FEEDBACK SECTION (ONLY AFTER EVENT IS OVER) ===== */}
//       {registered && !isEventOver && (
//         <p style={{ marginTop: "20px", color: "#555" }}>
//           Feedback will be available after the event.
//         </p>
//       )}

//       {registered && isEventOver && (
//         <div className="feedback-section">
//           <h3>Give Feedback</h3>

//           {submitted ? (
//             <p className="feedback-success">
//               Thank you for your feedback!
//             </p>
//           ) : (
//             <>
//               {/* ⭐ Rating */}
//               <div className="star-rating">
//                 {[1, 2, 3, 4, 5].map((star) => (
//                   <span
//                     key={star}
//                     className={star <= rating ? "star active" : "star"}
//                     onClick={() => setRating(star)}
//                   >
//                     ★
//                   </span>
//                 ))}
//               </div>

//               {/* 📝 Feedback */}
//               <textarea
//                 placeholder="Write your feedback (optional)"
//                 value={feedback}
//                 onChange={(e) => setFeedback(e.target.value)}
//               />

//               <button
//                 className="submit-feedback-btn"
//                 onClick={handleSubmitFeedback}
//               >
//                 Submit Feedback
//               </button>
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentEventDetails;
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/StudentEventDetails.css";

const StudentEventDetails = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [registered, setRegistered] = useState(false);

  const studentId = localStorage.getItem("studentId");

  // ✅ Fetch event by ID
  useEffect(() => {
    fetch(`http://localhost:5050/student/events/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvent(data.event);
        }
      })
      .catch(err => console.error("DETAIL FETCH ERROR:", err));
  }, [id]);

  // ✅ Check registration status
  useEffect(() => {
    if (!event) return;

    fetch(
      `http://localhost:5050/student/registration/check?studentId=${studentId}&eventId=${event._id}`
    )
      .then(res => res.json())
      .then(data => {
        if (data.registered) {
          setRegistered(true);
        }
      })
      .catch(err => console.error("CHECK REG ERROR:", err));
  }, [event, studentId]);

  if (!event) {
    return <p className="loading-text">Loading event...</p>;
  }

  const handleRegister = async () => {
    try {
      const res = await fetch("http://localhost:5050/student/register/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          eventId: event._id
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Registered Successfully");
        setRegistered(true);
      } else {
        alert(data.message || "Something went wrong");
      }

    } catch (err) {
      console.error("REGISTER ERROR:", err);
    }
  };

  return (
    <div className="event-details-page">
      <h2 className="event-title">{event.eventName}</h2>

      <div className="event-details-card">
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Organizer:</strong> {event.conductedBy?.name || "Unknown"}</p>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.startTime} - {event.endTime}</p>
        <p><strong>Location:</strong> {event.venue}</p>

        <p>
          <strong>Status:</strong>{" "}
          {registered ? "Registered" : "Not Registered"}
        </p>

        <button
          className={registered ? "registered-btn" : "register-btn"}
          onClick={handleRegister}
          disabled={registered}
        >
          {registered ? "Registered" : "Register"}
        </button>
      </div>
    </div>
  );
};

export default StudentEventDetails;