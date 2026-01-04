import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        {/* This is the home/welcome page */}
        <Route path="/" element={<Welcome />} />
        
        {/* This is the login page path */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;