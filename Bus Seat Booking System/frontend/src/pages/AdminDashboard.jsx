import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import { getAllBookings } from "../api/bookingApi";
import { AuthContext } from "../context/AuthContext";
import { adminLogout } from "../api/adminAuth";

import AddScheduleModal from "./AddScheduleModal";
import MarkSeatsModal from "./MarkSeatsModal";
import DeleteScheduleModal from "./DeleteScheduleModal";
import AddRouteModal from "./AddRouteModal";

import "../styles/main.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, logoutUser } = useContext(AuthContext);

  // dropdown state
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);

  // modal state
  const [showSchedule, setShowSchedule] = useState(false);
  const [showMarkSeats, setShowMarkSeats] = useState(false);
  const [showDeleteSchedule, setShowDeleteSchedule] = useState(false);
  const [showAddRoute, setShowAddRoute] = useState(false);

  //  logout handler
  const handleAdminLogout = () => {
    adminLogout();
    logoutUser();
    navigate("/admin/login");
  };

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAllBookings();

        if (Array.isArray(data)) {
          setBookings(data);
        } else {
          console.error("Invalid bookings data:", data);
          setBookings([]);
        }
      } catch (err) {
        console.error("Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const todayCount = bookings.filter((b) => {
    const bookingDate = new Date(b.bookingDate);
    const today = new Date();
    return bookingDate.toDateString() === today.toDateString();
  }).length;

  const uniqueUsers = new Set(bookings.map((b) => b.user?.id).filter(Boolean))
    .size;

  //  Generate Report (CSV)
  const downloadCSV = () => {
    if (!bookings || bookings.length === 0) {
      alert("No bookings to export");
      return;
    }

    const headers = [
      "Booking ID",
      "Passenger Name",
      "Phone",
      "Email",
      "Seat",
      "Bus",
      "Booked By",
      "Booked By Role",
      "Booking Date",
    ];

    const rows = bookings.map((b) => [
      b.id ?? "",
      b.passengerName ?? "",
      b.phoneNumber ?? "",
      b.email ?? "",
      b.seat?.seatNumber ?? "",
      b.bus?.busNumber ?? "",
      b.user?.username ?? "",
      b.user?.role ?? "",
      b.bookingDate ? new Date(b.bookingDate).toISOString() : "",
    ]);

    const escape = (val) => {
      const s = String(val ?? "");
      if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
      return s;
    };

    const csv = [headers, ...rows]
      .map((r) => r.map(escape).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    a.href = url;
    a.download = `bookings-report-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  };

  // close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p className="loading-text">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div style={{ textAlign: "center", padding: "40px" }}>
          <p className="error-text">{error}</p>
          <button
            className="btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page admin-page">
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <span className="admin-title-icon">📊</span>
            Admin Dashboard
          </h1>
          <p className="admin-subtitle">
            Welcome, <b>{user?.username || "Admin"}</b>
          </p>
        </div>
      </div>

      {/* Dropdown actions */}
      <div className="admin-actions" ref={menuRef}>
        <button
          className="btn-ghost"
          onClick={() => setOpenMenu((s) => !s)}
          type="button"
        >
           Admin Actions ▾
        </button>

        {openMenu && (
          <div className="admin-dropdown">
            <button
              className="dropdown-item"
              onClick={() => {
                setOpenMenu(false);
                setShowSchedule(true);
              }}
              type="button"
            >
               Add Bus Schedule
            </button>

            <button
              className="dropdown-item"
              onClick={() => {
                setOpenMenu(false);
                setShowAddRoute(true);
              }}
              type="button"
            >
               Add Route
            </button>

            <button
              className="dropdown-item"
              onClick={() => {
                setOpenMenu(false);
                setShowMarkSeats(true);
              }}
              type="button"
            >
               Mark Seats
            </button>

            <button
              className="dropdown-item danger"
              onClick={() => {
                setOpenMenu(false);
                setShowDeleteSchedule(true);
              }}
              type="button"
            >
               Delete Bus Schedule
            </button>

            {/* ✅ Export CSV */}
            <button
              className="dropdown-item"
              onClick={() => {
                setOpenMenu(false);
                downloadCSV();
              }}
              type="button"
            >
               Export Bookings (CSV)
            </button>

            {/* ✅ Logout */}
            <button
              className="dropdown-item danger"
              onClick={handleAdminLogout}
              type="button"
            >
               Logout
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      {showSchedule && (
        <AddScheduleModal onClose={() => setShowSchedule(false)} />
      )}
      {showMarkSeats && (
        <MarkSeatsModal onClose={() => setShowMarkSeats(false)} />
      )}
      {showDeleteSchedule && (
        <DeleteScheduleModal onClose={() => setShowDeleteSchedule(false)} />
      )}
      {showAddRoute && <AddRouteModal onClose={() => setShowAddRoute(false)} />}

      {/* Stats */}
      <div className="admin-stats ">
        <div className="stat-card stat-purple">
          <div className="stat-label">Total Bookings</div>
          <div className="stat-value">{bookings.length}</div>
        </div>

        <div className="stat-card stat-pink">
          <div className="stat-label">Active Today</div>
          <div className="stat-value">{todayCount}</div>
        </div>

        <div className="stat-card stat-blue">
          <div className="stat-label">Unique Users</div>
          <div className="stat-value">{uniqueUsers}</div>
        </div>
      </div>

      {/* Admin Quick Actions */}
      {String(user?.role || "").toUpperCase() === "ADMIN" && (
        <div
          style={{
            background: "linear-gradient(135deg, #6f42c1 0%, #6610f2 100%)",
            color: "white",
            padding: "20px",
            borderRadius: "10px",
            marginBottom: "30px",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}> Admin Actions</h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <Link to="/add-admin" style={{ textDecoration: "none", color: "inherit" }}>
              <div 
                style={{
                  background: "rgba(255,255,255,0.2)",
                  padding: "15px",
                  borderRadius: "8px",
                  textAlign: "center",
                  cursor: "pointer",
                  border: "1px solid rgba(255,255,255,0.3)",
                  
                }}
              >
                <h4
                  style={{
                    margin: "0 0 10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    
                  }}
                >
                   Add Admin
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
                  Create new admin account
                </p>
              </div>
            </Link>

            {/*  Generate Report card */}
            <div
              onClick={downloadCSV}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                Generate Report
              </h4>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
                Export booking data (CSV)
              </p>
            </div>

            <div
              onClick={() => navigate("/manage-users")}
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "15px",
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.3)",
              }}
            >
              <h4
                style={{
                  margin: "0 0 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                 Manage Users
              </h4>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
                View all system users
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      <h2 className="admin-section-title">All Bookings</h2>

      {bookings.length === 0 ? (
        <div className="admin-empty">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Passenger</th>
                <th>Contact</th>
                <th>Seat</th>
                <th>Bus</th>
                <th>Booked By</th>
                <th>Date & Time</th>
              </tr>
            </thead>

            <tbody>
              {bookings.map((b) => (
                <tr key={b.id}>
                  <td>#{b.id}</td>
                  <td className="td-strong">{b.passengerName || "N/A"}</td>

                  <td>
                    <div>{b.phoneNumber || "N/A"}</div>
                    <div className="td-muted">{b.email || ""}</div>
                  </td>

                  <td>
                    <span className="seat-pill">
                      {b.seat?.seatNumber || "N/A"}
                    </span>
                  </td>

                  <td>{b.bus?.busNumber || "N/A"}</td>

                  <td>
                    {b.user?.username || "Guest"}
                    {b.user?.role === "ADMIN" && (
                      <span className="role-pill">Admin</span>
                    )}
                  </td>

                  <td className="td-muted">{formatDate(b.bookingDate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="admin-footer">
        <div>
          <b>System Summary:</b> Showing {bookings.length} booking(s).
        </div>
        <div className="td-muted">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>
    </div>
  );
}
