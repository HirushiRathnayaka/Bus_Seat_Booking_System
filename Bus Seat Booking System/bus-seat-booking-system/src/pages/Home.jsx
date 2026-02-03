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

  // state loading
  if (loading) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: "center" }}>
          <p className="page-subtitle">Loading routes...</p>
        </div>
      </div>
    );
  }

  // eror state
  if (error) {
    return (
      <div className="page">
        <div className="container" style={{ textAlign: "center" }}>
          <p className="page-subtitle">{error}</p>
          <button className="btn-primary" onClick={loadRoutes}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // main ui
  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title ">
          <span className="bus-icon">🚌</span>
          <span className="title-text"> Bus Seat Booking System</span>
        </h1>
        <p className="page-subtitle">Select your route to continue</p>

        <div className="route-list">
          {routes.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "white" }}>
              <p>No routes available at the moment.</p>
              <button className="btn-primary" onClick={loadRoutes}>
                Refresh
              </button>
            </div>

          ) : (
            routes.map((route) => (
              <div key={route.id} className="route-card">
                <div className="route-left">
                  <div className="route-name">
                    {route.fromCity} → {route.toCity}
                  </div>
                  <div className="route-meta">
                    Multiple buses available
                  </div>
                </div>

                <div className="route-right">
                  <span className="badge">Route #{route.id}</span>
                  <button
                    className="btn-primary"
                    onClick={() => handleSelectRoute(route.id)}
                  >
                    Select Route →
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="busFooter">
        <button className="btn-ghost" onClick={() => navigate("/login")} type="button">
          Back to Login
        </button>
      </div>
    </div>
    </div>
  );
};

export default Home;