import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SeatLayout from "../components/SeatLayout";
import { getSeatsByBus } from "../api/seatApi";
import "../styles/main.css";
import "../styles/SeatSelection.css"; // new css

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

        const response = await getSeatsByBus(busId);
        const seatsData = response.data || [];
        setSeats(seatsData);

        setBusInfo({
          busNumber: `BUS-${busId}`,
          departureTime: "08:00 AM",
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
    if (!seat.booked) setSelectedSeat(seat);
  };

  if (loading) {
    return (
      <div className="page seatPage">
        <div className="seatCenterMsg">
          <p className="loading-text">Loading seats...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page seatPage">
        <div className="seatCenterMsg">
          <p className="error-text">{error}</p>
          <button className="btn-primary" onClick={() => nav(-1)} style={{ marginTop: 14 }}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page seatPage">
      <div className="seatHeaderRow">

        <h2 className="seatTitle">Select Seat</h2>
      </div>

      {busInfo && (
        <div className="bus-info-white" style={{
          background: "#f8f9fa",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px"
        }}>
          <p><strong>Bus:</strong> {busInfo.busNumber}</p>
          <p><strong>Departure:</strong> {busInfo.departureTime}</p>
        </div>
      )}


      <div className="seatLegendCard">
        <h3 className="seatLegendTitle">Seat Legend</h3>

        <div className="seatLegendRow">
          <div className="seatLegendItem">
            <span className="seatSwatch seatSwatch--available" />
            <span className="seatLegendText">Available</span>
          </div>

          <div className="seatLegendItem">
            <span className="seatSwatch seatSwatch--booked" />
            <span className="seatLegendText">Booked</span>
          </div>

          <div className="seatLegendItem">
            <span className="seatSwatch seatSwatch--selected" />
            <span className="seatLegendText">Selected</span>
          </div>
        </div>
      </div>

      <div className="seatLayoutWrap">
        <SeatLayout seats={seats} select={handleSeatSelect} selectedSeat={selectedSeat} />
      </div>

      {selectedSeat && (
        <div className="selectedSeatCard">
          <h3 className="selectedSeatTitle">
            Selected Seat: <span className="selectedSeatNo">{selectedSeat.seatNumber}</span>
          </h3>

          <button
            className="btn-primary"
            onClick={() => nav("/booking", { state: { seat: selectedSeat, busId: busId } })}
            type="button"
          >
            Continue to Booking →
          </button>
        </div>
      )}

      <div className="seatFooter">
        <button className="btn-ghost" onClick={() => nav(-1)} type="button">
          Back to Buses
        </button>
      </div>
    </div>
  );
}
