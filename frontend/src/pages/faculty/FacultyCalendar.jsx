import { useEffect, useState } from "react";
import "../../styles/StudentCalendar.css";

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const FacultyCalendar = () => {
  const [monthIndex, setMonthIndex] = useState(1); // Feb
  const [year, setYear] = useState(2026);
  const [events, setEvents] = useState([]);

  const facultyEmail = localStorage.getItem("email");

  useEffect(() => {
    fetch("http://localhost:5050/faculty/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) setEvents(data.events);
      })
      .catch(err => console.error(err));
  }, []);

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

  // approved events
  const approvedDates = events
    .filter(e =>
      new Date(e.date).getMonth() === monthIndex &&
      new Date(e.date).getFullYear() === year
    )
    .map(e => new Date(e.date).getDate());

  // faculty events
  const facultyDates = events
    .filter(e =>
      e.conductedBy === facultyEmail &&
      new Date(e.date).getMonth() === monthIndex &&
      new Date(e.date).getFullYear() === year
    )
    .map(e => new Date(e.date).getDate());

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
          let cls = "calendar-day";

          if (approvedDates.includes(day)) cls += " event-day";
          if (facultyDates.includes(day)) cls += " faculty-day";

          return (
            <div key={day} className={cls}>
              {day}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <div>
          <span className="legend-box event"></span> Approved Event
        </div>
        <div>
          <span className="legend-box faculty"></span> My Event
        </div>
      </div>
    </div>
  );
};

export default FacultyCalendar;
