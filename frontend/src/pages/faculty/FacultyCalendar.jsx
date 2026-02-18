import { useEffect, useState } from "react";
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
  useEffect(() => {
    fetch("http://localhost:5050/admin/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events);
        }
      })
      .catch(err => console.error(err));
  }, [monthIndex, year]);

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
    <div className="student-calendar-page">
      <div className="calendar-header">
        <button className="nav-btn" onClick={prevMonth}>◀</button>
        <h2>{months[monthIndex]} {year}</h2>
        <button className="nav-btn" onClick={nextMonth}>▶</button>
      </div>

      <div className="calendar-grid">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`e-${i}`} className="calendar-day empty"></div>
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dayEvents = events.filter(e => {
            const d = new Date(e.date);
            return (
              d.getDate() === day &&
              d.getMonth() === monthIndex &&
              d.getFullYear() === year
            );
          });

          const hasMyEvent = dayEvents.some(
            e => e.conductedBy?._id === facultyId
          );

          const hasOtherEvent = dayEvents.length > 0;
          let cls = "calendar-day";
          if (hasMyEvent) {
            cls += " faculty-day";     // Blue
          } else if (hasOtherEvent) {
            cls += " event-day";       // Purple
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
      </div>
    </div>
  );
};

export default FacultyCalendar;
