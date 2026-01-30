import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBusesByRoute } from "../api/busApi";

function BusSelection() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const response = await getBusesByRoute(routeId);
        setBuses(response.data);
      } catch (err) {
        console.error("Error fetching buses:", err);
        setError("Failed to load buses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBuses();
  }, [routeId]);

  if (loading) {
    return (
      <div className="page">
        <p className="loading-text">Loading buses...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error-text">{error}</p>
        <button onClick={() => navigate("/home")} style={{ marginTop: "20px" }}>
          Back to Routes
        </button>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Select Bus</h2>
      <p>Choose a bus for your journey</p>
      
      <div className="route-list" style={{ marginTop: "30px" }}>
        {buses.length === 0 ? (
          <p>No buses available for this route. Please check back later.</p>
        ) : (
          buses.map(bus => (
            <div key={bus.id} className="route-card" 
                 onClick={() => navigate(`/seats/${bus.id}`)}
                 style={{ cursor: "pointer" }}>
              <div style={{ flex: 1 }}>
                <h3>Bus: {bus.busNumber}</h3>
                <p>Departure: {bus.departureTime}</p>
                <p>Date: {bus.travelDate}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ 
                  background: "#28a745", 
                  color: "white", 
                  padding: "5px 10px", 
                  borderRadius: "5px",
                  fontSize: "0.9rem"
                }}>
                  Available
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={() => navigate("/home")}>
          Back to Routes
        </button>
      </div>
    </div>
  );
}

export default BusSelection;