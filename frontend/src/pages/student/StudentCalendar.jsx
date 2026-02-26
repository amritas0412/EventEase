import { useEffect, useState } from "react";
import "../../styles/StudentCalendar.css";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const StudentCalendar = () => {
  const [placements, setPlacements] = useState([]);

  // ✅ MONTH & YEAR STATE
  const today = new Date();
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // 🔥 EVENTS FROM DB
  const [events, setEvents] = useState([]);
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

  useEffect(() => {
    fetch("http://localhost:5050/placement/all")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPlacements(data.placements);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const eventDates = events
    .filter(ev => {
      const d = new Date(ev.date);
      return (
        ev.status === "approved" &&   // 🔥 Important
        d.getMonth() === monthIndex &&
        d.getFullYear() === year
      );
    })
    .map(ev => new Date(ev.date).getDate());

  const placementDates = placements
    .filter(pl => {
      const d = new Date(pl.date);
      return (
        pl.status === "approved" &&
        d.getMonth() === monthIndex &&
        d.getFullYear() === year
      );
    })
    .map(pl => new Date(pl.date).getDate());

  // DYNAMIC CALCULATIONS
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = new Date(year, monthIndex, 1).getDay();

  // NAVIGATION
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

          const hasEvent = eventDates.includes(day);
          const hasPlacement = placementDates.includes(day);

          if (hasEvent && hasPlacement) { 
            className += " both-day";
          } else if (hasPlacement) {
            className += " placement-day";
          } else if (hasEvent) {
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
        <div>
          <span className="legend-box placement"></span> Placement
        </div>
      </div>

    </div>
  );
};

export default StudentCalendar;
