import { useEffect, useMemo, useState } from "react";
import { getBookingsByBus, cancelBooking } from "../api/bookingApi";
import "../styles/adminMarkSeats.css";

export default function MarkSeatsModal({ busId = 1, onClose }) {
  const [tab, setTab] = useState("reserved"); // reserved | cancelled
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getBookingsByBus(busId);
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || "Failed to load seats");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busId]);

  const reserved = useMemo(() => rows.filter((r) => r.status === "CONFIRMED"), [rows]);
  const cancelled = useMemo(() => rows.filter((r) => r.status === "CANCELLED"), [rows]);

  const list = tab === "reserved" ? reserved : cancelled;

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return list;

    return list.filter((r) => {
      const seat = String(r.seatNumber || "").toLowerCase();
      const ticket = String(r.ticketNo || "").toLowerCase();
      const passenger = String(r.passengerName || "").toLowerCase();
      const bus = String(r.busNumber || "").toLowerCase();
      return (
        seat.includes(term) ||
        ticket.includes(term) ||
        passenger.includes(term) ||
        bus.includes(term)
      );
    });
  }, [q, list]);

  const onCancel = async (id) => {
    try {
      setLoading(true);
      setError("");
      await cancelBooking(id);
      await load();
      setTab("cancelled"); // cancel- Cancelled tab 
    } catch (e) {
      setError(e?.response?.data?.error || e?.message || "Cancel failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card modal-lg" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>🪑 Seat Status (Bus ID: {busId})</h3>
          <button className="modal-x" onClick={onClose} type="button">
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
            className={tab === "cancelled" ? "tab active" : "tab"}
            onClick={() => setTab("cancelled")}
            type="button"
          >
            Cancelled Seats
          </button>
        </div>

        {/* Search */}
        <div className="adminSearchWrap">
          <input
            className="adminSearch"
            placeholder="Search seat / ticket / passenger / bus..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {error && <div className="msg error">{error}</div>}

        <div className="modal-body">
          {loading ? (
            <div className="modal-loading">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="modal-empty">
              No records found in <b>{tab}</b>.
            </div>
          ) : (
            <div className="adminTableWrap">
              <table className="adminTable">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Booking ID</th>
                    <th>Seat</th>
                    <th>Bus</th>
                    <th>Passenger</th>
                    <th>Phone</th>
                    <th>{tab === "reserved" ? "Action" : "Status"}</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((r) => (
                    <tr key={r.id}>
                      <td>{r.ticketNo}</td>
                      <td>{r.id}</td>
                      <td>{r.seatNumber}</td>
                      <td>{r.busNumber}</td>
                      <td>{r.passengerName}</td>
                      <td>{r.phoneNumber}</td>
                      <td>
                        {tab === "reserved" ? (
                          <button
                            className="btnDanger"
                            onClick={() => onCancel(r.id)}
                            type="button"
                          >
                            Cancel
                          </button>
                        ) : (
                          <span className="pillCancelled">CANCELLED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
