import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteUserAdmin, getAllUsersAdmin, updateUserRoleAdmin } from "../api/adminUserApi";
import "../styles/main.css";

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");
      setMsg("");
      const data = await getAllUsersAdmin();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.message || e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter((u) =>
      [u.username, u.email, u.firstName, u.lastName, u.role]
        .filter(Boolean)
        .some((x) => String(x).toLowerCase().includes(s))
    );
  }, [q, users]);

  const handleMakeAdmin = async (userId) => {
    if (!window.confirm("Make this user ADMIN?")) return;
    try {
      setErr("");
      setMsg("");
      await updateUserRoleAdmin(userId, "ADMIN");
      setMsg("✅ User promoted to ADMIN");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Role update failed");
    }
  };

  const handleRemoveAdmin = async (userId) => {
    if (!window.confirm("Remove admin privileges (make USER)?")) return;
    try {
      setErr("");
      setMsg("");
      await updateUserRoleAdmin(userId, "USER");
      setMsg("✅ Admin privileges removed");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Role update failed");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      setErr("");
      setMsg("");
      await deleteUserAdmin(userId);
      setMsg("✅ User deleted");
      load();
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="page">
        <p className="loading-text">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h1>👥 Manage Users</h1>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn-ghost" onClick={() => navigate("/admin/dashboard")} type="button">
            ← Back to Dashboard
          </button>

          <button className="btn-primary" onClick={() => navigate("/add-admin")} type="button" style={{ background: "#28a745" }}>
            ➕ Add New Admin
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
        <input
          placeholder="Search name / username / email / role..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 10, border: "1px solid #ddd" }}
        />
        <button className="btn-primary" onClick={load} type="button">
          Refresh
        </button>
      </div>

      {err && <div className="msg error">{err}</div>}
      {msg && <div className="msg success">{msg}</div>}

      <div
        style={{
          background: "white",
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>ID</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Name</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Username</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Email</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Role</th>
              <th style={{ padding: 12, textAlign: "left", borderBottom: "2px solid #ddd" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: 12 }}>#{u.id}</td>
                <td style={{ padding: 12, fontWeight: 500 }}>
                  {`${u.firstName || ""} ${u.lastName || ""}`.trim() || "-"}
                </td>
                <td style={{ padding: 12 }}>{u.username || "-"}</td>
                <td style={{ padding: 12 }}>{u.email || "-"}</td>
                <td style={{ padding: 12 }}>
                  <span
                    style={{
                      background: u.role === "ADMIN" ? "#dc3545" : "#007bff",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: 5,
                      fontSize: "0.9rem",
                    }}
                  >
                    {u.role || "USER"}
                  </span>
                </td>
                <td style={{ padding: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {u.role !== "ADMIN" ? (
                    <button
                      onClick={() => handleMakeAdmin(u.id)}
                      style={{ background: "#28a745", padding: "6px 10px", fontSize: "0.9rem" }}
                      type="button"
                    >
                      Make Admin
                    </button>
                  ) : (
                    u.username !== "admin" && (
                      <button
                        onClick={() => handleRemoveAdmin(u.id)}
                        style={{ background: "#ffc107", color: "#000", padding: "6px 10px", fontSize: "0.9rem" }}
                        type="button"
                      >
                        Remove Admin
                      </button>
                    )
                  )}

                  {/* Prevent deleting main admin */}
                  {u.username !== "admin" && (
                    <button
                      onClick={() => handleDelete(u.id)}
                      style={{ background: "#dc3545", padding: "6px 10px", fontSize: "0.9rem" }}
                      type="button"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div style={{ padding: 12, color: "#666" }}>No users found.</div>
        )}
      </div>
    </div>
  );
}
