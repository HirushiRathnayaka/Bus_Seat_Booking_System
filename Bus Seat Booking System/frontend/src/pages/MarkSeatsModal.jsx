import { useEffect, useMemo, useState } from "react";
import { getBookingsByBus, cancelBooking } from "../api/bookingApi";
import "../styles/adminMarkSeats.css";

export default function MarkSeatsModal({ busId, onClose }) {
  const [tab, setTab] = useState("reserved"); // reserved | cancelled
  const [rows, setRows] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    if (!busId) return;

    try {
      setLoading(true);
      setError("");
      const data = await getBookingsByBus(busId);
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("Failed to load seat details");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line
  }, [busId]);

  // 🔹 Reserved bookings
  const reserved = useMemo(
    () => rows.filter((r) => r.status === "RESERVED"),
    [rows]
  );

  // 🔹 Cancelled bookings
  const cancelled = useMemo(
    () => rows.filter((r) => r.status === "CANCELLED"),
    [rows]
  );

  const list = tab === "reserved" ? reserved : cancelled;

  // 🔍 Search
  const filtered = useMemo(() => {
    const term = q.toLowerCase();
    if (!term) return list;

    return list.filter((r) =>
      [
        r.ticketNo,
        r.seatNumber,
        r.busNumber,
        r.passengerName,
        r.phoneNumber,
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [q, list]);

  const onCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      setLoading(true);
      await cancelBooking(bookingId);
      await load();
      setTab("cancelled");
    } catch {
      setError("Cancel failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card modal-lg" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>🪑 Seat Status (Bus ID: {busId})</h3>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            className={tab === "reserved" ? "tab active" : "tab"}
            onClick={() => setTab("reserved")}
          >
            Reserved Seats
          </button>

          <button
            className={tab === "cancelled" ? "tab active" : "tab"}
            onClick={() => setTab("cancelled")}
          >
            Cancelled Seats
          </button>
        </div>

        {/* Search */}
        <div className="adminSearchWrap">
          <input
            className="adminSearch"
            placeholder="Search by seat / ticket / passenger / phone..."
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
                    <th>Action</th>
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
          <button className="btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
