import { useEffect, useState } from "react";
import { getAllBookings } from "../api/bookingApi";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
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
    return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="loading-text">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p className="error-text">{error}</p>
          <button onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        marginBottom: "20px" 
      }}>
        <div>
          <h1>📊 Admin Dashboard</h1>
          <p style={{ color: "#666" }}>
            Welcome, <strong>{user?.username || "Admin"}</strong>
          </p>
        </div>
        
        {/* Add Admin Button - Only show for admins */}
        {user?.role === "ADMIN" && (
          <Link to="/add-admin">
            <button style={{ 
              background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ fontSize: "1.2rem" }}>➕</span>
              Add New Admin
            </button>
          </Link>
        )}
      </div>
      
      {/* Admin Quick Actions */}
      {user?.role === "ADMIN" && (
        <div style={{ 
          background: "linear-gradient(135deg, #6f42c1 0%, #6610f2 100%)", 
          color: "white", 
          padding: "20px", 
          borderRadius: "10px",
          marginBottom: "30px"
        }}>
          <h3 style={{ marginBottom: "15px" }}>⚡ Admin Actions</h3>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
            gap: "15px" 
          }}>
            <Link to="/add-admin" style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: "rgba(255,255,255,0.2)", 
                padding: "15px", 
                borderRadius: "8px",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.3s ease",
                border: "1px solid rgba(255,255,255,0.3)"
              }}>
                <h4 style={{ margin: "0 0 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span>➕</span> Add Admin
                </h4>
                <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
                  Create new admin account
                </p>
              </div>
            </Link>
            
            <div style={{ 
              background: "rgba(255,255,255,0.2)", 
              padding: "15px", 
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.3)"
            }}>
              <h4 style={{ margin: "0 0 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span>👥</span> Manage Users
              </h4>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
                View all system users
              </p>
            </div>
            
            <div style={{ 
              background: "rgba(255,255,255,0.2)", 
              padding: "15px", 
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.3)"
            }}>
              <h4 style={{ margin: "0 0 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <span>📊</span> Generate Report
              </h4>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>
                Export booking data
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Statistics Section */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "20px", 
        marginBottom: "30px" 
      }}>
        <div style={{ 
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
          color: "white", 
          padding: "20px", 
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <h3>Total Bookings</h3>
          <p style={{ fontSize: "2.5rem", margin: "10px 0" }}>{bookings.length}</p>
        </div>
        
        <div style={{ 
          background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", 
          color: "white", 
          padding: "20px", 
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <h3>Active Today</h3>
          <p style={{ fontSize: "2.5rem", margin: "10px 0" }}>
            {bookings.filter(b => {
              const bookingDate = new Date(b.bookingDate);
              const today = new Date();
              return bookingDate.toDateString() === today.toDateString();
            }).length}
          </p>
        </div>
        
        <div style={{ 
          background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", 
          color: "white", 
          padding: "20px", 
          borderRadius: "10px",
          textAlign: "center"
        }}>
          <h3>Unique Users</h3>
          <p style={{ fontSize: "2.5rem", margin: "10px 0" }}>
            {new Set(bookings.map(b => b.user?.id).filter(id => id)).size}
          </p>
        </div>
      </div>
      
      {/* Bookings Table */}
      <div style={{ marginTop: "30px" }}>
        <h2>All Bookings</h2>
        
        {bookings.length === 0 ? (
          <div style={{ 
            textAlign: "center", 
            padding: "40px", 
            background: "#f8f9fa", 
            borderRadius: "10px",
            marginTop: "20px"
          }}>
            <p>No bookings found.</p>
          </div>
        ) : (
          <div style={{ 
            background: "white", 
            padding: "20px", 
            borderRadius: "10px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            overflowX: "auto",
            marginTop: "20px"
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f9fa" }}>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>ID</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Passenger</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Contact</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Seat</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Bus</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Booked By</th>
                  <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "12px" }}>#{b.id}</td>
                    <td style={{ padding: "12px", fontWeight: "500" }}>{b.passengerName || "N/A"}</td>
                    <td style={{ padding: "12px" }}>
                      <div>{b.phoneNumber || "N/A"}</div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>{b.email || ""}</div>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ 
                        background: "#e7f3ff", 
                        color: "#007bff", 
                        padding: "5px 10px", 
                        borderRadius: "5px",
                        fontWeight: "bold"
                      }}>
                        {b.seat?.seatNumber || "N/A"}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>{b.bus?.busNumber || "N/A"}</td>
                    <td style={{ padding: "12px" }}>
                      {b.user?.username || "Guest"}
                      {b.user?.role === "ADMIN" && (
                        <span style={{ 
                          background: "#dc3545", 
                          color: "white", 
                          fontSize: "0.8rem", 
                          padding: "2px 6px", 
                          borderRadius: "3px",
                          marginLeft: "5px"
                        }}>
                          Admin
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "12px", color: "#666" }}>
                      {formatDate(b.bookingDate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Summary */}
      <div style={{ 
        marginTop: "30px", 
        padding: "20px", 
        background: "#f8f9fa", 
        borderRadius: "10px",
        fontSize: "0.9rem",
        color: "#666"
      }}>
        <p><strong>System Summary:</strong> Showing {bookings.length} booking(s) in the system.</p>
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}