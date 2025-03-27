import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import General from './pages/General/General';
import UserProfile from './pages/UserProfile'; // Add the UserProfile page component
import { AuthProvider } from './context/AuthContext'; // Ensure the correct path


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<UserProfile />} /> {/* User profile page */}
          <Route path="/home" element={<General />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
