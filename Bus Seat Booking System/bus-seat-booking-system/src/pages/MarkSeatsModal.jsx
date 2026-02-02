import { useState, useEffect, useMemo } from "react";
import { getReservedSeats, getCancelledSeats } from "../api/adminApi";
import "../styles/main.css";

export default function MarkSeatsModal({ onClose }) {
  const [tab, setTab] = useState("reserve"); // reserved | canceled
  const [seatNumber, setSeatNumber] = useState("");
  const [q,] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        tab === "reserved" ? await getReservedSeats() : await getCancelledSeats();

      setSeatNumber(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.message || "Failed to load seats");
      setSeatNumber([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return seatNumber;
    return seatNumber.filter((s) =>
      String(s.seatNumber || s.seat_number || "")
        .toLowerCase()
        .includes(term)
    );
  }, [q, seatNumber]);

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card modal-lg" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>🪑 Seat Status</h3>
          <button className="modal-x" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={tab === "reserved" ? "tab active" : "tab"}
            onClick={() => setTab("reserved")}
            type="button"
          >
            Reserved Seats
          </button>
          <button
            className={tab === "available" ? "tab active" : "tab"}
            onClick={() => setTab("available")}
            type="button"
          >
            Cancelled Seats
          </button>
        </div>

        {error && <div className="msg error">{error}</div>}

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="modal-empty">
              No seats found in <b>{tab}</b>.
            </div>
          ) : (
            <div className="seat-grid">
              {filtered.map((s) => (
                <div key={s.id} className={`seat-chip ${tab}`}>
                  <div className="seat-no">
                    {s.seatNumber || s.seat_number || "N/A"}
                  </div>
                  <div className="seat-meta">
                    {tab === "reserved" ? "Reserved" : "Available"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose} type="button">
            Close
          </button>
        </div>
      </div>
    </div>
  );  
 
}
