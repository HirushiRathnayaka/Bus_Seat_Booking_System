import { useState } from "react";
import { createRoute } from "../api/adminApi";

export default function AddRouteModal({ onClose, onCreated }) {
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!fromCity || !toCity) {
      setError("Please fill From and To");
      return;
    }

    try {
      setLoading(true);
      await createRoute({ fromCity, toCity });
      onCreated?.(); // refresh list
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to create route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="modal-head">
          <h3>➕ Add Route</h3>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>

        {error && <div className="msg error">{error}</div>}

        <form onSubmit={submit} className="modal-form">
          <label>From</label>
          <input value={fromCity} onChange={(e)=>setFromCity(e.target.value)} placeholder="Colombo" />

          <label>To</label>
          <input value={toCity} onChange={(e)=>setToCity(e.target.value)} placeholder="Kandy" />

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Route"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
