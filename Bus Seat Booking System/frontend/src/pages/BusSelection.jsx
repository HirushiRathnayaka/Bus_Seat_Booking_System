import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBusesByRoute } from "../api/busApi";
import "../styles/main.css";
import "../styles/BusSelection.css";

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
        setBuses(response.data || []);
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
      <div className="page busPage">
        <div className="busCenterMsg">
          <p className="loading-text">Loading buses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page busPage">
        <div className="busCenterMsg">
          <p className="error-text">{error}</p>
          <button className="btn-primary" onClick={() => navigate("/home")} style={{ marginTop: 14 }}>
            Back to Routes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page busPage">
      <div className="busHeaderRow">
        <h2 className="busTitle">Select Bus</h2>
        <p className="busSubtitle">Choose a bus for your journey</p>
      </div>

      <div className="busList">
        {buses.length === 0 ? (
          <div className="busEmpty">
            <p>No buses available for this route. Please check back later.</p>
            <button className="btn-primary" onClick={() => navigate("/home")}>Back to Routes</button>
          </div>
        ) : (
          buses.map((bus) => (
            <button
              key={bus.id}
              className="busCard"
              onClick={() => navigate(`/seats/${bus.id}`)}
              type="button"
            >
              <div className="busCardLeft">
                <div className="busNumber">Bus: {bus.busNumber}</div>

                <div className="busMeta">
                  <div><span className="busMetaLabel">Departure:</span> {bus.departureTime}</div>
                  <div><span className="busMetaLabel">Date:</span> {bus.travelDate}</div>
                </div>
              </div>

              <div className="busCardRight">
                <span className="busStatus">Available</span>
                <span className="busArrow">→</span>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="busFooter">
        <button className="btn-ghost" onClick={() => navigate("/home")} type="button">
          Back to Routes
        </button>
      </div>
    </div>
  );
}

export default BusSelection;
