
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import RevenueReport from './pages/reports/RevenueReport';
import LocationHdSummary from './pages/reports/LocationHdSummary.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import './styles/theme.css';

const App = () => (
  <ErrorBoundary>
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<RevenueReport />} />
          <Route path="/reports/location-hd-summary" element={<LocationHdSummary />} />
        </Routes>
      </AppLayout>
    </Router>
  </ErrorBoundary>
);

export default App;
