import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FacultyCalendar.css";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const FacultyCalendar = () => {
  const today = new Date();   // 🔥 Get current date
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);
  const facultyId = localStorage.getItem("facultyId");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5050/faculty/events/calendar")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events);
        }
      })
      .catch(err => console.error(err));
  }, []); // Load all events once

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = new Date(year, monthIndex, 1).getDay();

  const prevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(y => y - 1);
    } else setMonthIndex(m => m - 1);
  };

  const nextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(y => y + 1);
    } else setMonthIndex(m => m + 1);
  };

  return (
    <div className="faculty-calendar-page">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="brand">EventEase</h2>
        <ul>
          <li
            onClick={() => navigate("/faculty/dashboard")}
            style={{ cursor: "pointer" }}
          >
            📊 Dashboard</li>
          <li
            onClick={() => navigate("/faculty/events")}
            style={{ cursor: "pointer" }}
          >
            📅 Events
          </li>
        </ul>
      </aside>

      <div className="calendar-content">
      <div className="calendar-header">
        <button className="nav-btn" onClick={prevMonth}>◀</button>
        <h2>{months[monthIndex]} {year}</h2>
        <button className="nav-btn" onClick={nextMonth}>▶</button>
      </div>

      <div className="calendar-grid">
        {/* Weekday Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`e-${i}`} className="calendar-day empty"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          // 
          const dayEvents = events.filter(e => {
  const d = new Date(e.date);
  return (
    d.getDate() === day &&
    d.getMonth() === monthIndex &&
    d.getFullYear() === year
  );
});

const myEvents = dayEvents.filter(
  e => e.conductedBy?._id === facultyId
);

const hasMyApproved = myEvents.some(e => e.status === "approved");
const hasMyPending = myEvents.some(e => e.status === "pending");
const hasOtherApproved = dayEvents.some(
  e => e.status === "approved" && e.conductedBy?._id !== facultyId
);

let cls = "calendar-day";

if (hasMyPending) {
  cls += " pending-day";        // 🟡 Yellow
} else if (hasMyApproved) {
  cls += " faculty-day";        // 🔵 Blue
} else if (hasOtherApproved) {
  cls += " event-day";          // 🟣 Purple
}
          return (
            <div key={day} className={cls}>
              {day}
            </div>
          );
        })}

      </div>
      <div className="calendar-legend">
        <div>
          <span className="legend-box event"></span> Events
        </div>
        <div>
          <span className="legend-box faculty"></span> My Event
        </div>
        <div>
          <span className="legend-box pending"></span> Pending Approval
        </div>
      </div>
      </div>
    </div>
  );
};

export default FacultyCalendar;
