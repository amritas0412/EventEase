import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/PlacementDashboard.css";
import { companies } from "../../data/companiesData";

const CompaniesVisited = () => {
  const navigate = useNavigate();


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
          {companies.map((company, index) => (
            <div key={index} className="event-card">
              <h4>{company.name}</h4>
              <p>Placed Students: {company.placed}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default CompaniesVisited;
