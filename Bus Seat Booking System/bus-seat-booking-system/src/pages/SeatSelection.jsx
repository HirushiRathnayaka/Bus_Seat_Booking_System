import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SeatLayout from "../components/SeatLayout";
import { getSeatsByBus } from "../api/seatApi";
import "../styles/main.css";

export default function SeatSelection() {
  const { busId } = useParams();
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        
        // Fetch seats
        const response = await getSeatsByBus(busId);
        const seatsData = response.data || [];
        setSeats(seatsData);
        
        // Set bus info
        setBusInfo({
          busNumber: `BUS-${busId}`,
          departureTime: "08:00 AM"
        });
        
      } catch (error) {
        console.error("Error fetching seats:", error);
        setError("Failed to load seats. Please try again.");
        setSeats([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [busId]);

  const handleSeatSelect = (seat) => {
    if (!seat.booked) {
      setSelectedSeat(seat);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="loading-text">Loading seats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="error-text">{error}</p>
          <button onClick={() => nav(-1)} style={{ marginTop: '20px' }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>Select Seat</h2>
      
      {busInfo && (
        <div style={{ 
          background: "#f8f9fa", 
          padding: "15px", 
          borderRadius: "10px", 
          marginBottom: "20px" 
        }}>
          <p><strong>Bus:</strong> {busInfo.busNumber}</p>
          <p><strong>Departure:</strong> {busInfo.departureTime}</p>
        </div>
      )}
      
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h3>Seat Legend</h3>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", background: "#28a745", borderRadius: "5px" }}></div>
            <span>Available</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", background: "#dc3545", borderRadius: "5px" }}></div>
            <span>Booked</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div style={{ width: "20px", height: "20px", background: "#007bff", borderRadius: "5px" }}></div>
            <span>Selected</span>
          </div>
        </div>
      </div>
      
      <SeatLayout 
        seats={seats} 
        select={handleSeatSelect} 
        selectedSeat={selectedSeat} 
      />
      
      {selectedSeat && (
        <div style={{ 
          background: "#e7f3ff", 
          padding: "20px", 
          borderRadius: "10px", 
          marginTop: "30px",
          textAlign: "center" 
        }}>
          <h3>Selected Seat: {selectedSeat.seatNumber}</h3>
          <button 
            onClick={() => nav("/booking", { state: { seat: selectedSeat, busId: busId } })}
            style={{ marginTop: "10px", padding: "10px 20px", fontSize: "16px" }}
          >
            Continue to Booking
          </button>
        </div>
      )}
      
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={() => nav(-1)}>
          Back to Buses
        </button>
      </div>
    </div>
  );
}