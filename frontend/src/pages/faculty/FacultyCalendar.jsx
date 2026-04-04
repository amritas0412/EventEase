import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/FacultyCalendar.css";
import FacultySidebar from "../../component/FacultySidebar.jsx";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const FacultyCalendar = () => {
  const today = new Date();

  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());
  const [events, setEvents] = useState([]);

  //Selected date (instead of popup)
  const [selectedDate, setSelectedDate] = useState(null);

  const facultyId = localStorage.getItem("facultyId");
  const navigate = useNavigate();

  //Fetch events
  useEffect(() => {
    fetch("http://localhost:5050/faculty/events/calendar")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setEvents(data.events);
        }
      })
      .catch(err => console.error(err));
  }, []);

  
  const parseDate = (dateStr) => {
    if (!dateStr) return null;
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d);
  };

  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = new Date(year, monthIndex, 1).getDay();

  // Month navigation
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
    <div className="faculty-calendar-page">

      {/* Sidebar */}
      <FacultySidebar />

      <div className="calendar-content">

        {/* Header */}
        <div className="calendar-header">
          <button className="nav-btn" onClick={prevMonth}>◀</button>
          <h2>{months[monthIndex]} {year}</h2>
          <button className="nav-btn" onClick={nextMonth}>▶</button>
        </div>

        {/* Grid */}
        <div className="calendar-grid">

          {/* Weekdays */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}

          {/* Empty slots */}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`e-${i}`} className="calendar-day empty"></div>
          ))}

          {/* Days */}
          {/* {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;

            const dayEvents = events.filter(e => {
              const d = parseDate(e.date);
              return (
                d &&
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

            if (hasMyPending) cls += " pending-day";
            else if (hasMyApproved) cls += " faculty-day";
            else if (hasOtherApproved) cls += " event-day";

            if (selectedDate === day) cls += " selected-day";

            return (
              <div
                key={day}
                className={cls}
                onClick={() => setSelectedDate(day)}
                style={{ cursor: "pointer" }}
              >
                {day}
              </div>
            );
          })} */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;

            const currentDate = new Date(year, monthIndex, day);

            const todayDate = new Date();
            todayDate.setHours(0, 0, 0, 0);

            const isPast = currentDate < todayDate;

            const dayEvents = events.filter(e => {
              const d = parseDate(e.date);
              return (
                d &&
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

            if (hasMyPending) cls += " pending-day";
            else if (hasMyApproved) cls += " faculty-day";
            else if (hasOtherApproved) cls += " event-day";

            
            if (isPast && dayEvents.length > 0) {
              cls += " past-day";
            }
const isToday =
  currentDate.toDateString() === todayDate.toDateString();
  if (isToday) cls += " today";
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

        {/* Legend */}
        <div className="calendar-legend">
          <div><span className="legend-box event"></span> Events</div>
          <div><span className="legend-box faculty"></span> My Event</div>
          <div><span className="legend-box pending"></span> Pending Approval</div>
        </div>

        {/*DETAILS SECTION (LIKE MANAGE CALENDAR) */}
        {selectedDate && (
          <div className="date-details">
            <h3>{selectedDate} {months[monthIndex]} {year}</h3>

            {events.filter(e => {
              const d = parseDate(e.date);
              return (
                d &&
                d.getDate() === selectedDate &&
                d.getMonth() === monthIndex &&
                d.getFullYear() === year
              );
            }).map(ev => (
              <div key={ev._id} className="popup-event">
                <strong>📌 {ev.eventName}</strong>
                <p>Time: {ev.startTime || "N/A"}</p>

                {ev.conductedBy?._id === facultyId && (
                  <p className="my-event-label">👤 Your Event</p>
                )}
              </div>
            ))}

            {/* Empty */}
            {events.filter(e => {
              const d = parseDate(e.date);
              return (
                d &&
                d.getDate() === selectedDate &&
                d.getMonth() === monthIndex &&
                d.getFullYear() === year
              );
            }).length === 0 && (
                <p>No events on this day</p>
              )}
          </div>
        )}

      </div>
    </div>
  );
};

export default FacultyCalendar;