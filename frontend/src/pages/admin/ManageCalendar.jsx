import { useState } from "react";
import "../../styles/ManageCalendar.css";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// helpers
const getDaysInMonth = (month, year) =>
  new Date(year, month + 1, 0).getDate();

const getStartDay = (month, year) =>
  new Date(year, month, 1).getDay();

const ManageCalendar = () => {
  const [monthIndex, setMonthIndex] = useState(0);
  const [year, setYear] = useState(2026);

  const [eventDates, setEventDates] = useState([5, 12, 18, 25]);
  const [placementDates, setPlacementDates] = useState([8, 20, 28]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [inputDate, setInputDate] = useState("");

  const daysInMonth = getDaysInMonth(monthIndex, year);
  const startDay = getStartDay(monthIndex, year);

  const addEvent = () => {
    const day = Number(inputDate);
    if (day >= 1 && day <= daysInMonth && !eventDates.includes(day)) {
      setEventDates([...eventDates, day]);
      setInputDate("");
    }
  };

  const addPlacement = () => {
    const day = Number(inputDate);
    if (day >= 1 && day <= daysInMonth && !placementDates.includes(day)) {
      setPlacementDates([...placementDates, day]);
      setInputDate("");
    }
  };

  const prevMonth = () => {
    if (monthIndex === 0) {
      setMonthIndex(11);
      setYear(year - 1);
    } else setMonthIndex(monthIndex - 1);
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (monthIndex === 11) {
      setMonthIndex(0);
      setYear(year + 1);
    } else setMonthIndex(monthIndex + 1);
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

      {/* CONTROLS */}
      <div className="calendar-controls">
        <input
          type="number"
          min="1"
          max={daysInMonth}
          placeholder="Day"
          value={inputDate}
          onChange={(e) => setInputDate(e.target.value)}
        />
        <button className="sync-btn" onClick={addEvent}>Add Event</button>
        <button className="placement-btn" onClick={addPlacement}>
          Add Placement
        </button>
      </div>

      {/* CALENDAR */}
      <div className="calendar-grid">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          let cls = "calendar-day";
          if (eventDates.includes(day)) cls += " event-day";
          if (placementDates.includes(day)) cls += " placement-day";
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

      {/* DETAILS */}
      {selectedDate && (
        <div className="date-details">
          <h3>{selectedDate} {months[monthIndex]} {year}</h3>

          {eventDates.includes(selectedDate) && (
            <p className="event-text">📌 Event scheduled</p>
          )}

          {placementDates.includes(selectedDate) && (
            <p className="placement-text">
              💼 Placement / Internship scheduled
            </p>
          )}

          {!eventDates.includes(selectedDate) &&
            !placementDates.includes(selectedDate) && (
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

export default ManageCalendar;
