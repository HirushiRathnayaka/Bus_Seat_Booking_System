import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ManageUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Mock data - in real app, fetch from API
  const mockUsers = [
    { id: 1, firstName: "Admin", lastName: "User", username: "admin", email: "admin@bus.com", role: "ADMIN", createdAt: "2024-01-01" },
    { id: 2, firstName: "John", lastName: "Doe", username: "johndoe", email: "john@example.com", role: "USER", createdAt: "2024-11-25" },
    { id: 3, firstName: "Jane", lastName: "Smith", username: "janesmith", email: "jane@example.com", role: "USER", createdAt: "2024-11-24" },
    { id: 4, firstName: "Robert", lastName: "Johnson", username: "robertj", email: "robert@example.com", role: "USER", createdAt: "2024-11-23" },
    { id: 5, firstName: "Sarah", lastName: "Williams", username: "sarahw", email: "sarah@example.com", role: "USER", createdAt: "2024-11-22" },
  ];
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 500);
  }, []);
  
  const handleMakeAdmin = (userId) => {
    if (window.confirm("Are you sure you want to make this user an admin?")) {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: "ADMIN" } : user
      ));
      alert("User promoted to admin!");
    }
  };
  
  const handleRemoveAdmin = (userId) => {
    if (window.confirm("Are you sure you want to remove admin privileges?")) {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: "USER" } : user
      ));
      alert("Admin privileges removed!");
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1>👥 Manage Users</h1>
        <button onClick={() => navigate("/add-admin")} style={{ background: "#28a745" }}>
          ➕ Add New Admin
        </button>
      </div>
      
      <div style={{ 
        background: "white", 
        padding: "20px", 
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>ID</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Name</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Username</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Email</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Role</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Joined</th>
              <th style={{ padding: "12px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>#{user.id}</td>
                <td style={{ padding: "12px", fontWeight: "500" }}>
                  {user.firstName} {user.lastName}
                </td>
                <td style={{ padding: "12px" }}>{user.username}</td>
                <td style={{ padding: "12px" }}>{user.email}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ 
                    background: user.role === "ADMIN" ? "#dc3545" : "#007bff", 
                    color: "white", 
                    padding: "5px 10px", 
                    borderRadius: "5px",
                    fontSize: "0.9rem"
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: "12px", color: "#666" }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: "12px" }}>
                  {user.role === "USER" ? (
                    <button 
                      onClick={() => handleMakeAdmin(user.id)}
                      style={{ 
                        background: "#28a745", 
                        padding: "5px 10px", 
                        fontSize: "0.9rem" 
                      }}
                    >
                      Make Admin
                    </button>
                  ) : (
                    user.username !== "admin" && (
                      <button 
                        onClick={() => handleRemoveAdmin(user.id)}
                        style={{ 
                          background: "#ffc107", 
                          color: "#000", 
                          padding: "5px 10px", 
                          fontSize: "0.9rem" 
                        }}
                      >
                        Remove Admin
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div style={{ marginTop: "30px", display: "flex", gap: "15px" }}>
        <button onClick={() => navigate("/admin")}>
          Back to Dashboard
        </button>
        <button onClick={() => navigate("/add-admin")} style={{ background: "#28a745" }}>
          Add Another Admin
        </button>
      </div>
    </div>
  );
}