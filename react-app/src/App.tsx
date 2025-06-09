import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Prediction from './pages/Prediction';
import History from './pages/History';
import './App.css';
import logo from './logo_bluelephant.png';

const App = () => {
  return (
    <Router>
      <nav className="navbar">
        <div className="navbar-logo">
          <img src={logo} alt="BluElephant Logo"/>
        </div>
        <div className="navbar-links">
          <Link to="/home">Home</Link>
          <span className="separator">|</span>
          <Link to="/prediction">Prediction</Link>
          <span className="separator">|</span>
          <Link to="/history">History</Link>
        </div>
        <div className="navbar-spacer" />
      </nav>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>  
    </Router>
  );
};

export default App;
