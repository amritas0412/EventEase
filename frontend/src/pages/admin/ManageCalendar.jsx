import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);
  
  const today = new Date();
  const [events, setEvents] = useState([]);
  const [placements, setPlacements] = useState([]);
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const [eventDates, setEventDates] = useState([]);
  const [placementDates, setPlacementDates] = useState([]);

  const [selectedDate, setSelectedDate] = useState(null);
  const [inputDate, setInputDate] = useState("");

  const daysInMonth = getDaysInMonth(monthIndex, year);
  const startDay = getStartDay(monthIndex, year);

  const addEvent = async () => {
    const day = Number(inputDate);

    if (!day || day < 1 || day > daysInMonth) return;

    const eventName = prompt("Enter Event Name:");
    if (!eventName) return;

    const fullDate = new Date(year, monthIndex, day);

    try {
      const res = await fetch("http://localhost:5050/admin/add-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          eventName,
          date: fullDate.toISOString()
        })
      });

      const data = await res.json();

      if (data.success) {
        setEventDates(prev => [...prev, day]);
        setInputDate("");
      }

    } catch (err) {
      console.error(err);
    }
  };
  const addPlacement = async () => {
    const day = Number(inputDate);

    if (!day || day < 1 || day > daysInMonth) return;

    const fullDate = new Date(year, monthIndex, day);

    try {
      await fetch("http://localhost:5050/admin/add-placement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          company: "Admin Company",
          role: "Role",
          date: fullDate
        })
      });

      setInputDate("");

      window.location.reload();

    } catch (err) {
      console.error(err);
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
  useEffect(() => {
    fetch("http://localhost:5050/admin/events")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // const backendDays = (data.events || [])
          //   .filter(e => {
          //     const d = new Date(e.date);
          //     return (
          //       d.getMonth() === monthIndex &&
          //       d.getFullYear() === year
          //     );
          //   })
          //   .map(e => new Date(e.date).getDate());
          // setEventDates(backendDays);
          setEvents(data.events || []);

          const backendDays = (data.events || [])
            .filter(e => {
              const d = new Date(e.date);
              return (
                d.getMonth() === monthIndex &&
                d.getFullYear() === year
              );
            })
            .map(e => new Date(e.date).getDate());

          setEventDates(backendDays);

        }
      })
      .catch(err => console.error(err));
  }, [monthIndex, year]);


  useEffect(() => {
    fetch("http://localhost:5050/placement/all")
      .then(res => res.json())
      .then(data => {
        console.log("API DATA:", data);

        if (data.success) {
          setPlacements(data.placements || []);

          const days = (data.placements || [])
            .filter(p => {
              const d = new Date(p.date);
              return (
                p.status === "approved" &&
                d.getMonth() === monthIndex &&
                d.getFullYear() === year
              );
            })
            .map(p => new Date(p.date).getDate());

          setPlacementDates(days);
        }
      })
      .catch(err => console.error(err));
  }, [monthIndex, year]);


  return (
    <div className="student-calendar-page">

      <div className="top-bar-profile">
        <div className="profile-container">
          <div
            className="profile-icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
          >
            👤
          </div>

          {showDropdown && (
            <div className="profile-dropdown">
              <p className="profile-email">
                {localStorage.getItem("email")}
              </p>
              <button className="logout-btn" onClick={() => {
                localStorage.clear();
                navigate("/login", { replace: true });
              }}>
                Logout
              </button>
            </div>
          )}
        </div>

      </div>

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
        {/* <button className="placement-btn" onClick={addPlacement}>
          Add Placement
        </button> */}
      </div>

      {/* CALENDAR */}
      <div className="calendar-grid">{/* Weekday Headers */}
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}

        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty"></div>
        ))}

        {/* {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          let cls = "calendar-day";
          // if (eventDates.includes(day)) cls += " event-day";
          // if (placementDates.includes(day)) cls += " placement-day";
          const currentDate = new Date(year, monthIndex, day);

          // normalize today
          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);

          const isPast = currentDate < todayDate;

          const hasEvent = eventDates.includes(day);
          const hasPlacement = placementDates.includes(day);

          // priority
          if (hasEvent && hasPlacement) cls += " both-day";
          else if (hasPlacement) cls += " placement-day";
          else if (hasEvent) cls += " event-day";

          //  fade past (only if something exists)
          if (isPast && (hasEvent || hasPlacement)) {
            cls += " past-day";
          }
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
        })} */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          let cls = "calendar-day";

          const currentDate = new Date(year, monthIndex, day);

          const todayDate = new Date();
          todayDate.setHours(0, 0, 0, 0);
const isToday =
  currentDate.toDateString() === todayDate.toDateString();
          const isPast = currentDate < todayDate;

          const hasEvent = eventDates.includes(day);
          const hasPlacement = placementDates.includes(day);

          if (hasEvent && hasPlacement) cls += " both-day";
          else if (hasPlacement) cls += " placement-day";
          else if (hasEvent) cls += " event-day";

          if (isPast && (hasEvent || hasPlacement)) {
            cls += " past-day";
          }

          if (selectedDate === day) cls += " selected-day";
if (isToday) cls += " today";
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

          {/* EVENTS */}
          {events
            .filter(e => {
              const d = new Date(e.date);
              return (
                d.getDate() === selectedDate &&
                d.getMonth() === monthIndex &&
                d.getFullYear() === year
              );
            })
            .map(e => (
              <p key={e._id} className="event-text">
                📌 {e.eventName}
              </p>
            ))}

          {/* PLACEMENTS */}
          {placements
            .filter(p => {
              const d = new Date(p.date);
              return (
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
            const d = new Date(e.date);
            return (
              d.getDate() === selectedDate &&
              d.getMonth() === monthIndex &&
              d.getFullYear() === year
            );
          }).length === 0 &&
            placements.filter(p => {
              const d = new Date(p.date);
              return (
                d.getDate() === selectedDate &&
                d.getMonth() === monthIndex &&
                d.getFullYear() === year &&
                p.status === "approved"
              );
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

export default ManageCalendar;
