import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Axios yapılandırması
import './utils/axios';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Statistics from './pages/Statistics';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import Subscription from './pages/Subscription';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  const [theme, setTheme] = useState('light');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <ThemeProvider data-bs-theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={
            !isAuthenticated ? 
            <Login setIsAuthenticated={setIsAuthenticated} /> : 
            <Navigate to="/dashboard" />
          } />

          <Route path="/register" element={
            !isAuthenticated ? 
            <Register /> : 
            <Navigate to="/dashboard" />
          } />
          
          <Route element={<Layout theme={theme} setTheme={setTheme} />}>
            <Route path="/dashboard" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/statistics/:linkId" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Statistics />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/edit-profile" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <EditProfile />
              </ProtectedRoute>
            } />
            
            <Route path="/subscription" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Subscription />
              </ProtectedRoute>
            } />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
