import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Pages
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Home from "./pages/Home";
import RouteSelection from "./pages/RouteSelection";
import BusSelection from "./pages/BusSelection";
import SeatSelection from "./pages/SeatSelection";
import BookingForm from "./pages/BookingForm";
import BookingSuccess from "./pages/BookingSuccess";
import AdminDashboard from "./pages/AdminDashboard";
import AddAdmin from "./pages/AddAdmin";
import AdminLogin from "./pages/auth/AdminLogin";
import TicketPage from "./pages/TicketPage";
import ManageUsers from "./pages/ManageUsers"; // ✅ ADD

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: "100vh" }}>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            {/* Public */}
            <Route path="/login" element={<SignIn />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* User Protected */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="/routes"
              element={
                <ProtectedRoute>
                  <RouteSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/route-selection/:routeId"
              element={
                <ProtectedRoute>
                  <BusSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/buses/:routeId"
              element={
                <ProtectedRoute>
                  <BusSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/seats/:busId"
              element={
                <ProtectedRoute>
                  <SeatSelection />
                </ProtectedRoute>
              }
            />
            <Route
              path="/booking"
              element={
                <ProtectedRoute>
                  <BookingForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/success"
              element={
                <ProtectedRoute>
                  <BookingSuccess />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ticket"
              element={
                <ProtectedRoute>
                  <TicketPage />
                </ProtectedRoute>
              }
            />

            {/* Admin Protected */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/add-admin"
              element={
                <AdminRoute>
                  <AddAdmin />
                </AdminRoute>
              }
            />

            {/* ✅ Manage Users */}
            <Route
              path="/manage-users"
              element={
                <AdminRoute>
                  <ManageUsers />
                </AdminRoute>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
