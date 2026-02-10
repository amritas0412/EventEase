import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PlacementDashboard.css";

const CompaniesVisited = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const today = new Date();

  useEffect(() => {
    fetch("http://localhost:5050/placement/all")
      .then((res) => res.json())
      .then((data) => {
        const placements = data.placements || [];

        // completed + approved drives
        const completed = placements.filter(
          (d) => d.status === "approved" && new Date(d.date) < today
        );

        // group by company name
        const companyMap = {};

        completed.forEach((d) => {
          if (!companyMap[d.name]) {
            companyMap[d.name] = {
              name: d.name,
              placed: 0,
            };
          }

          companyMap[d.name].placed += d.totalPlaced || 0;
        });

        setCompanies(Object.values(companyMap));
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="placement-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="brand">EventEase</h2>
        <ul>
          <li onClick={() => navigate("/placement/dashboard")}>📊 Dashboard</li>
          <li className="active">🏢 Companies</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2>🏢 Companies Visited</h2>

        <div className="panel-grid">
          {companies.length > 0 ? (
            companies.map((company, index) => (
            <div key={index} className="event-card">
              <h4>{company.name}</h4>
              <p>Placed Students: {company.placed}</p>
            </div>
            ))
          ) : (
            <div className="event-card empty-card">
              <p>No companies have completed drives yet</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CompaniesVisited;
