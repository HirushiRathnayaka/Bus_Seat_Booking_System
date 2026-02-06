import { useEffect,  useState, useMemo } from "react";
import { createSchedule, getRoutes, getBusesByRoute  } from "../api/adminApi";
import "../styles/main.css";

export default function AddScheduleModal({ onClose }) {
  const [routes, setRoutes] = useState([]);
  const [routeId, setRouteId] = useState("");
  const [, setBuses] = useState([]);
  const [busId, setBusId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");
  const [loading, setLoading] = useState(false);

  // When routeId changes -> load route info + buses
  // ✅ load routes when modal opens
  useEffect(() => {
    const loadRoutes = async () => {
      try {
        setError("");
        const list = await getRoutes();     // ✅ returns data array
        setRoutes(list || []);
      } catch (e) {
        setError(e?.message || "Failed to load routes");
      }
    };
    loadRoutes();
  }, []);

  // ✅ when route changes, load buses
  useEffect(() => {
    const loadBuses = async () => {
      setBuses([]);
      setBusId("");
      if (!routeId) return;

      try {
        setError("");
        const list = await getBusesByRoute(Number(routeId)); // ✅ returns data array
        setBuses(list || []);
      } catch (e) {
        setError(e?.message || "Failed to load buses for this route");
      }
    };

    loadBuses();
  }, [routeId]);

    //  selected route preview (From → To)
  const selectedRoute = useMemo(
    () => routes.find(r => String(r.id) === String(routeId)),
    [routes, routeId]
  );

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setOk("");

    if (!routeId || !busId || !date || !time) {
      setError("Please fill Route,Bus, Date and Time");
      return;
    }

    try {
      setLoading(true);
      await createSchedule({ routeId: Number(routeId), date, time });
      setOk(" Schedule added!");
      setTimeout(() => onClose(), 900);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to add schedule");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e)=>e.stopPropagation()}>
        <div className="modal-head">
          <h3>➕ Add New Bus</h3>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>

        {error && <div className="msg error">{error}</div>}
        {ok && <div className="msg ok">{ok}</div>}

        <form onSubmit={submit} className="modal-form">
          <label>Route</label>
          <select value={routeId} onChange={(e)=>setRouteId(e.target.value)}>
            <option value="">Select route...</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>
                {r.fromCity} → {r.toCity} (#{r.id})
              </option>
            ))}
          </select>

          {selectedRoute && (
            <div className="msg ok" style={{ marginTop: 6 }}>
              From <b>{selectedRoute.fromCity}</b> → To <b>{selectedRoute.toCity}</b>
            </div>
          )}

          <label>Bus Number</label>
          <input
            value={busId}
            onChange={(e)=>setBusId(e.target.value)}
            placeholder="ex:NC 1617"
          />

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
