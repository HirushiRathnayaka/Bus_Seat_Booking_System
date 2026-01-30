import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRoutes } from "../api/routeApi";
import "../styles/RouteSelection.css";

export default function RouteSelection() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const data = await getAllRoutes();
        setRoutes(data);
      } catch (err) {
        console.error("Failed to fetch routes:", err);
        setError("Failed to load routes. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRoutes();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <p className="loading-text">Loading routes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-text">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>🚌 Bus Seat Booking System</h1>
      <p className="subtitle">Select your route to continue</p>
      
      <div className="routes-container">
        {routes.map((r) => (
          <div
            key={r.id}
            className="route-card"
            onClick={() => nav(`/buses/${r.id}`)}
          >
            <span className="route-text">{r.fromCity}</span>
            <span className="route-arrow">→</span>
            <span className="route-text">{r.toCity}</span>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={() => nav("/home")}>
          Back to Home
        </button>
      </div>
    </div>
  );
}