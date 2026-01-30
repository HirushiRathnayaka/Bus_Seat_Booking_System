import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import Home from './pages/Home';
import RouteSelection from './pages/RouteSelection';
import BusSelection from './pages/BusSelection';
import SeatSelection from './pages/SeatSelection';
import BookingForm from './pages/BookingForm';
import BookingSuccess from './pages/BookingSuccess';
import AdminDashboard from './pages/AdminDashboard';
import AddAdmin from './pages/AddAdmin';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            <Route path="/routes" element={
              <ProtectedRoute>
                <RouteSelection />
              </ProtectedRoute>
            } />
            
            <Route path="/route-selection/:routeId" element={
              <ProtectedRoute>
                <BusSelection />
              </ProtectedRoute>
            } />
            
            <Route path="/buses/:routeId" element={
              <ProtectedRoute>
                <BusSelection />
              </ProtectedRoute>
            } />
            
            <Route path="/seats/:busId" element={
              <ProtectedRoute>
                <SeatSelection />
              </ProtectedRoute>
            } />
            
            <Route path="/booking" element={
              <ProtectedRoute>
                <BookingForm />
              </ProtectedRoute>
            } />
            
            <Route path="/success" element={
              <ProtectedRoute>
                <BookingSuccess />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/add-admin" element={
              <ProtectedRoute>
                <AddAdmin />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;