import { useEffect, useMemo, useState } from "react";
import { deleteBus, getBusesByRoute, getRoutes } from "../api/adminApi";
import "../styles/main.css";

export default function DeleteScheduleModal({ onClose }) {
  const [routes, setRoutes] = useState([]);
  const [buses, setBuses] = useState([]);
  

  const [routeId, setRouteId] = useState("");
  const [busId, setBusId] = useState("");
  

  const [loadingRoutes, setLoadingRoutes] = useState(false);
  const [loadingBuses, setLoadingBuses] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  //  load routes when modal opens
  useEffect(() => {
    const loadRoutes = async () => {
      setError("");
      setOk("");
      setLoadingRoutes(true);
      try {
        const list = await getRoutes();
        setRoutes(Array.isArray(list) ? list : []);
      } catch (e) {
        setError(e.message || "Failed to load routes");
      } finally {
        setLoadingRoutes(false);
      }
    };
    loadRoutes();
  }, []);

  //  when route selected -> load buses
  useEffect(() => {
    const loadBuses = async () => {
      setError("");
      setOk("");

      setBuses([]);
      setBusId("");
    

      if (!routeId) return;

      setLoadingBuses(true);
      try {
        const list = await getBusesByRoute(Number(routeId));
        setBuses(Array.isArray(list) ? list : []);
      } catch (e) {
        setError(e.message || "Failed to load buses");
      } finally {
        setLoadingBuses(false);
      }
    };
    loadBuses();
  }, [routeId]);

  const selectedRoute = useMemo(
    () => routes.find((r) => String(r.id) === String(routeId)),
    [routes, routeId]
  );

  const selectedBus = useMemo(
    () => buses.find((b) => String(b.id) === String(busId)),
    [buses, busId]
  );

  const doDelete = async () => {
    setError("");
    setOk("");

    if (!routeId) return setError("Please select a Route");
    if (!busId) return setError("Please select a Bus");

    try {
      setDeleting(true);
      await deleteBus(Number(routeId), Number(busId));
      setOk("Bus deleted!");
      setBuses((prev) => prev.filter((b) => String(b.id) !== String(busId)));
      setBusId("");

      setTimeout(() => onClose(), 900);

    } catch (e) {
      setError(e.message || "Failed to delete bus");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>Delete Bus Schedule</h3>
          <button className="modal-x" onClick={onClose}>×</button>
        </div>

        {error && <div className="msg error">{error}</div>}
        {ok && <div className="msg ok">{ok}</div>}

        <div className="modal-form">
          <label>Route</label>
          <select
            className="modal-select"
            value={routeId}
            onChange={(e) => setRouteId(e.target.value)}
            disabled={loadingRoutes}
          >
            <option value="">
              {loadingRoutes ? "Loading routes..." : "-- Select Route --"}
            </option>

            {routes.map((r) => (
              <option key={r.id} value={r.id}>
                {r.fromCity} → {r.toCity} (Route #{r.id})
              </option>
            ))}
          </select>

          {selectedRoute && (
            <div className="msg ok" style={{ marginTop: 6 }}>
              Selected: <b>{selectedRoute.fromCity}</b> → <b>{selectedRoute.toCity}</b>
            </div>
          )}

          <label>Bus</label>
          <select
            className="modal-select"
            value={busId}
            onChange={(e) => setBusId(e.target.value)}
            disabled={!routeId || loadingBuses}
          >
            <option value="">
              {!routeId
                ? "Select route first"
                : loadingBuses
                ? "Loading buses..."
                : "-- Select Bus --"}
            </option>

            {buses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.busNumber} | {b.travelDate} | {b.departureTime} (ID: {b.id})
              </option>
            ))}
          </select>

          {selectedBus && (
            <div className="msg ok" style={{ marginTop: 6 }}>
               Selected Bus: <b>{selectedBus.busNumber}</b> | {selectedBus.travelDate} | {selectedBus.departureTime}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="button" className="btn-danger" onClick={doDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
