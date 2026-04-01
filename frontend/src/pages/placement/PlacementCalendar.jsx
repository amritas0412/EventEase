import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PlacementCalendar.css"; 

const months = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const PlacementCalendar = () => {
  const [monthIndex, setMonthIndex] = useState(new Date().getMonth()); // current month
  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5050/placement/all")  // fetch all placement drives
      .then(res => res.json())
      .then(data => {
        console.log("PLACEMENTS:", data.placements);
        setEvents(data.placements);
      })
      .catch(err =>  console.error(err));
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
  .filter(e => {
    if (!e.date) return false;

    //  FIX: force local date (no timezone shift)
    const [y, m, d] = e.date.split("-").map(Number);
    const eventDate = new Date(y, m - 1, d);

    return (
      e.status?.toLowerCase().trim() === "approved" &&
      eventDate.getMonth() === monthIndex &&
      eventDate.getFullYear() === year
    );
  })
  .map(e => {
    const [_, __, d] = e.date.split("-").map(Number);
    return d;
  });

  const pendingDates = events
  .filter(e => {
    if (!e.date) return false;

    const [y, m, d] = e.date.split("-").map(Number);
    const eventDate = new Date(y, m - 1, d);

    return (
      e.status?.toLowerCase().trim() === "pending" &&
      eventDate.getMonth() === monthIndex &&
      eventDate.getFullYear() === year
    );
  })
  .map(e => {
    const [_, __, d] = e.date.split("-").map(Number);
    return d;
  });

  return (
    <div className="placement-calendar-page">
      {/* Sidebar */}
      <aside className="placement-sidebar">
        <div className="sidebar-header">
          <div className="logo-icon">E</div>
          <span className="logo-text">EventEase</span>
        </div>

        <ul>
          <li
            onClick={() => navigate("/placement/dashboard")}
            style={{ cursor: "pointer" }}
          >
            📊 Dashboard
          </li>
          <li
            onClick={() => navigate("/placement/placements")}
            style={{ cursor: "pointer" }}
          >
            📅 Placements
          </li>
        </ul>
      </aside>

      <div className="calendar-content">
        <div className="calendar-header">
          <button className="nav-btn" onClick={prevMonth}>◀</button>
          <h2>{months[monthIndex]} {year}</h2>
          <button className="nav-btn" onClick={nextMonth}>▶</button>
        </div>

        <div className="placement-calendar-grid">
          {/* Weekday Headers */}
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="calendar-weekday">
              {day}
            </div>
          ))}
          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`e-${i}`} className="placement-day-cell empty"></div>
          ))}
{Array.from({ length: daysInMonth }, (_, i) => {
  const day = i + 1;
  let cls = "placement-day-cell";

  const currentDate = new Date(year, monthIndex, day);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const isPast = currentDate < todayDate;
  const isToday =
    currentDate.toDateString() === todayDate.toDateString();

  const isApproved = approvedDates.includes(day);
  const isPending = pendingDates.includes(day);

  // priority
  if (isApproved) cls += " placement-approved";
  else if (isPending) cls += " placement-pending";

  // ✅ fade past
  if (isPast && (isApproved || isPending)) {
    cls += " past-day";
  }

  // ✅ highlight today
  if (isToday) cls += " today";

  return (
    <div key={day} className={cls}>
      {day}
    </div>
  );
})}
        </div>

        <div className="calendar-legend">
          <div className="legend-item">
            <span className="legend-box placement-approved"></span>
            Approved Placement Drive
          </div>

          <div className="legend-item">
            <span className="legend-box placement-pending"></span>
            Pending Placement Request
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementCalendar;
