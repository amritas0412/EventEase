import { useEffect, useState } from "react";
import "../../styles/StudentCalendar.css";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const StudentCalendar = () => {

  // ✅ MONTH & YEAR STATE
  const today = new Date();
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // 🔥 EVENTS FROM DB
  const [events, setEvents] = useState([]);

  // 📡 FETCH APPROVED EVENTS
  // useEffect(() => {
  //   fetch("http://localhost:5050/faculty/events")
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.success) {
  //         setEvents(data.events);
  //       }
  //     })
  //     .catch(err =>
  //       console.error("CALENDAR FETCH ERROR:", err)
  //     );
  // }, []);
useEffect(() => {
  fetch("http://localhost:5050/faculty/events")
    .then(res => res.json())
    .then(data => {
      console.log("CALENDAR EVENTS:", data.events); // 👈 ADD THIS
      if (data.success) {
        setEvents(data.events);
      }
    });
}, []);

  // 🎯 FILTER EVENTS FOR CURRENT MONTH/YEAR
  const eventDates = events
    .filter(ev => {
      const d = new Date(ev.date);
      return (
        d.getMonth() === monthIndex &&
        d.getFullYear() === year
      );
    })
    .map(ev => new Date(ev.date).getDate());

  // ✅ DYNAMIC CALCULATIONS
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = new Date(year, monthIndex, 1).getDay();

  // ✅ NAVIGATION
  const prevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(y => y - 1);
    } else {
      setMonthIndex(i => i - 1);
    }
  };

  const nextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(y => y + 1);
    } else {
      setMonthIndex(i => i + 1);
    }
  };

  return (
    <div className="student-calendar-page">

      {/* ===== HEADER ===== */}
      <div className="calendar-header">
        <button className="nav-btn" onClick={prevMonth}>◀</button>
        <h2>{months[monthIndex]} {year}</h2>
        <button className="nav-btn" onClick={nextMonth}>▶</button>
      </div>

      {/* ===== GRID ===== */}
      <div className="calendar-grid">

        {/* Empty slots */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="calendar-day empty"
          />
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;

          let className = "calendar-day";

          if (eventDates.includes(day)) {
            className += " event-day";
          }

          return (
            <div
              key={day}
              className={className}
            >
              {day}
            </div>
          );
        })}

      </div>

      {/* ===== LEGEND ===== */}
      <div className="calendar-legend">
        <div>
          <span className="legend-box event"></span> Event
        </div>
      </div>

    </div>
  );
};

export default StudentCalendar;
