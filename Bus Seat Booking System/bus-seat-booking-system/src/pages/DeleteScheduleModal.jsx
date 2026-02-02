import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/main.css"; // ✅ correct path inside src

export default function DeleteScheduleModal({ isOpen, onClose, onDeleted}) {
  const [schedules, setSchedules] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setError("");
    setMsg("");
    setSelectedId("");
    setLoading(true);

    axios
      .get("http://localhost:8083/api/schedules")
      .then((res) => {
        setSchedules(res.data || []);
      })
      .catch((e) => {
        setError("Schedules load වෙන්න බැරි වුණා. API / CORS check කරන්න.");
        setSchedules([]);
      })
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleDelete = async () => {
    if (!selectedId) {
      setMsg("Please select a schedule.");
      return;
    }

    setLoading(true);
    setMsg("");
    setError("");

    try {
      // real backend delete
      await axios.delete(`http://localhost:8083/api/schedules/${selectedId}`);

      setSchedules((prev) => prev.filter((s) => String(s.id) !== String(selectedId)));
      setSelectedId("");

      setMsg("✅ Schedule deleted successfully!");
      
      if (onDeleted) onDeleted(selectedId);
      onClose();

    } catch (e) {
      setMsg("❌ Failed to delete schedule. Try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="modal-overlay" onMouseDown={onClose}>
      <div className="modal-card" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>🗑️ Delete Bus Schedule</h3>
          <button className="btn-close" onClick={onClose} type="button">✕</button>
        </div>

        <div className="modal-body">
          <label style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>
            Select Schedule
          </label>

          {loading ? (
            <p>Loading schedules...</p>
          ) : (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{ width: "100%", padding: 10, borderRadius: 10 }}
          >
            <option value="">-- Select --</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.id}>
                 #{s.id} • {s.fromCity ?? "-"} → {s.toCity ?? "-"}
                  {s.date ? ` • ${s.date}` : ""}{s.time ? ` ${s.time}` : ""}
              </option>
            ))}
          </select>
          )}

          {(msg || error) && (
            <p style={{ marginTop: 12, color: msg.includes("✅") ? "green" : "red" }}>
              {msg}
            </p>
          )}
        </div>

        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose} type="button" disabled={loading}>
            Cancel
          </button>
          <button className="btn-danger" onClick={handleDelete} type="button" disabled={loading}>
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
