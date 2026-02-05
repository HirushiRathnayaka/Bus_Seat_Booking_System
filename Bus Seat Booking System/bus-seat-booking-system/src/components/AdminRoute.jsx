import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, authLoading } = useContext(AuthContext);
  const location = useLocation();

  if (authLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <p>Loading...</p>
      </div>
    );
  }

  // not logged in -> admin login
  if (!user) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  // logged in but not admin
  if (String(user.role || "").toUpperCase() !== "ADMIN") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
