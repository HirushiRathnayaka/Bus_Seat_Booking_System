import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRoutes } from "../api/routeApi";
import "../styles/main.css";

const Home = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      setLoading(true);
      const data = await getAllRoutes();
      setRoutes(data || []);
    } catch (error) {
      console.error("Error loading routes:", error);
      setError("Failed to load routes. Please try again later.");
      setRoutes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoute = (routeId) => {
    navigate(`/buses/${routeId}`);
  };

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="loading-text">Loading routes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="error-text">{error}</p>
          <button onClick={loadRoutes} style={{ marginTop: '20px' }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>🚌 Bus Seat Booking System</h1>
      <p className="subtitle">Select your route to continue</p>
      
      <div className="route-list">
        {routes.length === 0 ? (
          <div style={{ textAlign: 'center', width: '100%', padding: '40px' }}>
            <p>No routes available at the moment. Please check back later.</p>
            <button onClick={loadRoutes} style={{ marginTop: '20px' }}>
              Refresh
            </button>
          </div>
        ) : (
          routes.map((route) => (
            <div key={route.id} className="route-card">
              <div style={{ flex: 1 }}>
                <h3>{route.fromCity} → {route.toCity}</h3>
                <p style={{ color: "#666", marginTop: "5px" }}>
                  Multiple buses available
                </p>
              </div>
              <button onClick={() => handleSelectRoute(route.id)}>
                Select Route
              </button>
            </div>
          ))
        )}
      </div>
      
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button onClick={() => navigate("/admin")}>
          Admin Dashboard
        </button>
      </div>
    </div>
  );
};

export default Home;