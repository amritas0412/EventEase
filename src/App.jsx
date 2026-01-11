import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Welcome from './pages/Welcome';
import Login from './pages/Login';

import PlacementDashboard from './pages/PlacementDashboard';
import Placements from './pages/Placements';

import FacultyDashboard from './pages/FacultyDashboard';
import FacultyEvents from './pages/FacultyEvents';



function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        {/* Placement Cell */}
        <Route path="/placement-dashboard" element={<PlacementDashboard />} />
        <Route path="/placement-events" element={<Placements />} />

        {/* Faculty */}
        <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty-events" element={<FacultyEvents />} />

        

      </Routes>
    </Router>
  );
}

export default App;