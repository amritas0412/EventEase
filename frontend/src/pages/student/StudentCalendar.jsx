import { useEffect, useState } from "react";
import "../../styles/StudentCalendar.css";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const StudentCalendar = () => {
  const today = new Date();

  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [events, setEvents] = useState([]);
  const [placements, setPlacements] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);

  // ✅ Fetch events
  useEffect(() => {
    fetch("http://localhost:5050/admin/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) setEvents(data.events || []);
      })
      .catch(err => console.error(err));
  }, []);

  // ✅ Fetch placements
  useEffect(() => {
    fetch("http://localhost:5050/placement/all")
      .then(res => res.json())
      .then(data => {
        if (data.success) setPlacements(data.placements || []);
      })
      .catch(err => console.error(err));
  }, []);

  // ✅ Safe date parser (IMPORTANT)
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = new Date(year, monthIndex, 1).getDay();

  // 🔥 Highlight logic
  const eventDates = events
    .filter(ev => {
      const d = parseDate(ev.date);
      return (
        ev.status === "approved" &&
        d &&
        d.getMonth() === monthIndex &&
        d.getFullYear() === year
      );
    })
    .map(ev => parseDate(ev.date).getDate());

  const placementDates = placements
    .filter(pl => {
      const d = parseDate(pl.date);
      return (
        pl.status === "approved" &&
        d &&
        d.getMonth() === monthIndex &&
        d.getFullYear() === year
      );
    })
    .map(pl => parseDate(pl.date).getDate());

  // ⬅️➡️ Navigation
  const prevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(y => y - 1);
    } else {
      setMonthIndex(m => m - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(y => y + 1);
    } else {
      setMonthIndex(m => m + 1);
    }
    setSelectedDate(null);
  };

  return (
    <div className="student-calendar-page">

      {/* HEADER */}
      <div className="calendar-header">
        <button onClick={prevMonth}>◀</button>
        <h2>{months[monthIndex]} {year}</h2>
        <button onClick={nextMonth}>▶</button>
      </div>

      {/* GRID */}
      <div className="calendar-grid">

        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;

          let cls = "calendar-day";

          const hasEvent = eventDates.includes(day);
          const hasPlacement = placementDates.includes(day);

          if (hasEvent && hasPlacement) cls += " both-day";
          else if (hasPlacement) cls += " placement-day";
          else if (hasEvent) cls += " event-day";

          if (selectedDate === day) cls += " selected-day";

          return (
            <div
              key={day}
              className={cls}
              onClick={() => setSelectedDate(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* ✅ DETAILS SECTION (LIKE MANAGE CALENDAR) */}
      {selectedDate && (
        <div className="date-details">
          <h3>{selectedDate} {months[monthIndex]} {year}</h3>

          {/* EVENTS */}
          {events
            .filter(e => {
              const d = parseDate(e.date);
              return (
                d &&
                d.getDate() === selectedDate &&
                d.getMonth() === monthIndex &&
                d.getFullYear() === year &&
                e.status === "approved"
              );
            })
            .map(e => (
              <p key={e._id} className="event-text">
                📌 {e.eventName} ({e.startTime || "N/A"})
              </p>
            ))}

          {/* PLACEMENTS */}
          {placements
            .filter(p => {
              const d = parseDate(p.date);
              return (
                d &&
                d.getDate() === selectedDate &&
                d.getMonth() === monthIndex &&
                d.getFullYear() === year &&
                p.status === "approved"
              );
            })
            .map(p => (
              <p key={p._id} className="placement-text">
                💼 {p.name} — {p.jobrole}
              </p>
            ))}

          {/* EMPTY */}
          {events.filter(e => {
            const d = parseDate(e.date);
            return d &&
              d.getDate() === selectedDate &&
              d.getMonth() === monthIndex &&
              d.getFullYear() === year;
          }).length === 0 &&
           placements.filter(p => {
            const d = parseDate(p.date);
            return d &&
              d.getDate() === selectedDate &&
              d.getMonth() === monthIndex &&
              d.getFullYear() === year &&
              p.status === "approved";
          }).length === 0 && (
            <p>No events or placements on this day.</p>
          )}
        </div>
      )}

      {/* LEGEND */}
      <div className="calendar-legend">
        <div><span className="legend-box event"></span> Event</div>
        <div><span className="legend-box placement"></span> Placement</div>
      </div>

    </div>
  );
};

export default StudentCalendar;