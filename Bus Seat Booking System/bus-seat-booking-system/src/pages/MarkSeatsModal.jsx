import { useState } from "react";
import "../styles/main.css";

export default function MarkSeatsModal({ onClose }) {
  const [tab, setTab] = useState("reserve"); // reserve | cancel
  const [seatNumber, setSeatNumber] = useState("");

  const handleReserve = () => {
    alert(`Seat ${seatNumber} reserved ✅`);
    setSeatNumber("");
  };

  const handleCancel = () => {
    alert(`Seat ${seatNumber} reservation cancelled ❌`);
    setSeatNumber("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">

        <div className="modal-header">
          <h3>🪑 Mark Seats</h3>
          <button className="btn-close" onClick={onClose}>✖</button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={tab === "reserve" ? "tab active" : "tab"}
            onClick={() => setTab("reserve")}
          >
            Reserve Seat
          </button>
          <button
            className={tab === "cancel" ? "tab active" : "tab"}
            onClick={() => setTab("cancel")}
          >
            Cancel Reservation
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          <input
            placeholder="Seat Number (ex: A1)"
            value={seatNumber}
            onChange={(e) => setSeatNumber(e.target.value)}
          />

          {tab === "reserve" ? (
            <button className="btn-primary" onClick={handleReserve}>
              Reserve Seat
            </button>
          ) : (
            <button className="btn-danger" onClick={handleCancel}>
              Cancel Reservation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
