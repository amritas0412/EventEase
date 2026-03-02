import { useEffect, useState } from "react";
import "../../styles/PlacementCalendar.css"; // copy FacultyCalendar.css if needed

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const PlacementCalendar = () => {
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth()); // current month
  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5050/placement/all")  // fetch all placement drives
      .then(res => res.json())
      .then(data => {
        if (data.placements) setEvents(data.placements);
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

  // placement drives approved and in this month
  const approvedDates = events
    .filter(e =>
      e.status === "approved" &&
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
          let cls = "calendar-day";

          if (approvedDates.includes(day)) cls += " placement-day";

          return (
            <div key={day} className={cls}>
              {day}
            </div>
          );
        })}
      </div>

      <div className="calendar-legend">
        <div>
          <span className="legend-box placement"></span> Approved Placement Drive
        </div>
      </div>
    </div>
  );
};

export default PlacementCalendar;
