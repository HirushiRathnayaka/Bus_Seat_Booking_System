import { useState } from "react";
import { createSchedule } from "../api/adminApi";
import "../styles/main.css";

export default function AddScheduleModal({ onClose }) {
  const [routeId, setRouteId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setOk("");

    if (!routeId || !date || !time) {
      setError("Please fill Route, Date and Time");
      return;
    }

    try {
      setLoading(true);
      await createSchedule({ routeId: Number(routeId), date, time });
      setOk("✅ Schedule added!");
      setTimeout(() => onClose(), 900);
    } catch (err) {
      setError(err?.message || "Failed to add schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="modal-head">
          <h3>➕ Add Bus Schedule</h3>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>

        {error && <div className="msg error">{error}</div>}
        {ok && <div className="msg ok">{ok}</div>}

        <form onSubmit={submit} className="modal-form">
          <label>Route ID</label>
          <input value={routeId} onChange={(e)=>setRouteId(e.target.value)} placeholder="ex: 1" />

          <label>Date</label>
          <input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />

          <label>Time</label>
          <input type="time" value={time} onChange={(e)=>setTime(e.target.value)} />

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
