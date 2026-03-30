import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SimplifiedAdvisory from './pages/SimplifiedAdvisory';
import DiseaseDetection from './pages/DiseaseDetection';
import DiseaseHistory from './pages/DiseaseHistory';
import MarketPrices from './pages/MarketPrices';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/advisory" element={<SimplifiedAdvisory />} />
          <Route path="/disease-detection" element={<DiseaseDetection />} />
          <Route path="/disease-history" element={<DiseaseHistory />} />
          <Route path="/market-prices" element={<MarketPrices />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
