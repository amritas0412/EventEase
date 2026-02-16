import React, { useEffect, useState } from "react";

const FacultyProfile = ({ events }) => {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    totalEvents: 0,
  });

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email) return;

    let name = "";

    if (email === "btbtc0000_aishvarya@banasthali.in") {
      name = "Dr. Aishvarya Garg";
    } else if (email === "btbtc0001_prabhat@banasthali.in") {
      name = "Dr. Prabhat Mishra";
    }

    setProfile({
      name,
      email,
      totalEvents: events ? events.length : 0,
    });
  }, [events]);

  return (
    <>
      <p className="profile-name">{profile.name}</p>
      <p className="profile-email">{profile.email}</p>
      <p className="profile-stat">
        Total Events Conducted: <strong>{profile.totalEvents}</strong>
      </p>
    </>
  );
};

export default FacultyProfile;
