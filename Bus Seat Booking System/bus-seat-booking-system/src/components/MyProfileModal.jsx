import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { getUserBookings, cancelBooking } from "../api/bookingApi";
import "../styles/profileModal.css"; // or use main.css

export default function MyProfileModal({ onClose }) {
  const { user } = useContext(AuthContext);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadTickets = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      setErr("");
      const data = await getUserBookings(user.id);
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr("Failed to load tickets");
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const onCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      // reload after cancel so status updates
      loadTickets();
    } catch (e) {
      alert(e?.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card modal-lg" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>👤 My Profile</h3>
          <button className="modal-x" onClick={onClose} type="button">×</button>
        </div>

        <div className="profileTop">
          <div className="profileRow">
            <b>Name:</b> <span>{user?.firstName ? `${user.firstName} ${user.lastName}` : "-"}</span>
          </div>
          <div className="profileRow">
            <b>Email:</b> <span>{user?.email || "-"}</span>
          </div>
        </div>

        <h4 className="sectionTitle">🎫 My Tickets</h4>

        {err && <div className="msg error">{err}</div>}

        <div className="tableWrap">
          {loading ? (
            <div className="modal-loading">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="modal-empty">No tickets found.</div>
          ) : (
            <table className="profileTable">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Booking ID</th>
                  <th>Seat</th>
                  <th>Bus</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td className="mono">{t.ticketNo}</td>
                    <td>{t.id}</td>
                    <td>{t.seatNumber}</td>
                    <td>{t.busNumber}</td>
                    <td>
                      {t.status === "CANCELLED" ? (
                        <span className="pillCancelled">CANCELLED</span>
                      ) : (
                        <span className="pillConfirmed">CONFIRMED</span>
                      )}
                    </td>
                    <td>
                      {t.status === "CANCELLED" ? (
                        <button className="btnDisabled" disabled type="button">
                          Cancelled
                        </button>
                      ) : (
                        <button
                          className="btnDanger"
                          onClick={() => onCancel(t.id)}
                          type="button"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
