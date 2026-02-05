import { useState } from "react";
import "../../styles/StudentCalendar.css";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const StudentCalendar = () => {
  // ✅ MONTH & YEAR STATE
  const [monthIndex, setMonthIndex] = useState(0); // January
  const [year, setYear] = useState(2026);

  // Dummy highlighted dates
  const eventDates = [5, 12, 18, 25];
  const placementDates = [8, 20, 28];

  // ✅ DYNAMIC CALCULATIONS
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = new Date(year, monthIndex, 1).getDay();

  // ✅ NAVIGATION HANDLERS
  const prevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(year - 1);
    } else {
      setMonthIndex(monthIndex - 1);
    }
  };

  const nextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(year + 1);
    } else {
      setMonthIndex(monthIndex + 1);
    }
  };

  return (
    <div className="student-calendar-page">
      {/* ===== HEADER WITH NAVIGATION ===== */}
      <div className="calendar-header">
        <button className="nav-btn" onClick={prevMonth}>◀</button>
        <h2>{months[monthIndex]} {year}</h2>
        <button className="nav-btn" onClick={nextMonth}>▶</button>
      </div>

      {/* ===== WEEKDAYS ===== */}
      {/*<div className="calendar-weekdays">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>*/}

      {/* ===== CALENDAR GRID ===== */}
      <div className="calendar-grid">
        {/* Empty slots */}
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}

        {/* Days */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          let className = "calendar-day";

          if (eventDates.includes(day)) className += " event-day";
          if (placementDates.includes(day)) className += " placement-day";

          return (
            <div key={day} className={className}>
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
        <div>
          <span className="legend-box placement"></span> Placement
        </div>
      </div>
    </div>
  );
};

export default StudentCalendar;
