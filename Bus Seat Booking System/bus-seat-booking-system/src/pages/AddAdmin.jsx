import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/main.css";

export default function AddAdmin() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [adminData, setAdminData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setAdminData({
      ...adminData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError("");
  };
  
  const validateForm = () => {
    // Check if current user is admin
    if (user?.role !== "ADMIN") {
      setError("Only administrators can create new admin accounts");
      return false;
    }
    
    if (!adminData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!adminData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!adminData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!adminData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!adminData.email.includes("@") || !adminData.email.includes(".")) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!adminData.password) {
      setError("Password is required");
      return false;
    }
    if (adminData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (adminData.password !== adminData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare admin data
      const newAdmin = {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        username: adminData.username,
        email: adminData.email,
        password: adminData.password,
        role: "ADMIN"
      };
      
      // Call API to create admin
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newAdmin)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create admin");
      }
      
      setSuccess(`✅ Admin "${adminData.username}" created successfully!`);
      
      // Reset form
      setAdminData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
      
    } catch (err) {
      console.error("Error creating admin:", err);
      setError(err.message || "Failed to create admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page">
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "20px" 
        }}>
          <div>
            <h1 style={{ marginBottom: "5px" }}>➕ Create New Admin</h1>
            <p style={{ color: "#666" }}>
              Add a new administrator to the bus booking system
            </p>
          </div>
          <button 
            onClick={() => navigate("/admin")}
            style={{ background: "#6c757d" }}
          >
            ← Back to Dashboard
          </button>
        </div>
        
        {/* Current Admin Info */}
        {user && user.role === "ADMIN" && (
          <div style={{ 
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
            color: "white", 
            padding: "15px", 
            borderRadius: "10px",
            marginBottom: "20px"
          }}>
            <p style={{ margin: 0 }}>
              <strong>Logged in as:</strong> {user.username} (ADMIN)
            </p>
          </div>
        )}
        
        {/* Error Message */}
        {error && (
          <div style={{ 
            background: "#fee", 
            color: "#dc3545", 
            padding: "15px", 
            borderRadius: "10px", 
            marginBottom: "20px",
            border: "1px solid #f5c6cb"
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Success Message */}
        {success && (
          <div style={{ 
            background: "#d4edda", 
            color: "#155724", 
            padding: "15px", 
            borderRadius: "10px", 
            marginBottom: "20px",
            border: "1px solid #c3e6cb"
          }}>
            <strong>Success!</strong> {success}
          </div>
        )}
        
        {/* Main Form */}
        <div style={{ 
          background: "white", 
          padding: "30px", 
          borderRadius: "15px",
          boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
          marginBottom: "30px"
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ 
                marginBottom: "20px", 
                color: "#333",
                paddingBottom: "10px",
                borderBottom: "2px solid #f0f0f0"
              }}>
                Admin Information
              </h3>
              
              <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "600",
                    color: "#555"
                  }}>
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={adminData.firstName}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div style={{ flex: 1 }}>
                  <label style={{ 
                    display: "block", 
                    marginBottom: "8px", 
                    fontWeight: "600",
                    color: "#555"
                  }}>
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={adminData.lastName}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#555"
                }}>
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={adminData.username}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  required
                  disabled={loading}
                />
                <small style={{ 
                  color: "#666", 
                  display: "block", 
                  marginTop: "5px",
                  fontSize: "0.9rem"
                }}>
                  This will be used for login
                </small>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#555"
                }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={adminData.email}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ 
                marginBottom: "20px", 
                color: "#333",
                paddingBottom: "10px",
                borderBottom: "2px solid #f0f0f0"
              }}>
                Security Settings
              </h3>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#555"
                }}>
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={adminData.password}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  minLength="6"
                  required
                  disabled={loading}
                />
                <small style={{ 
                  color: "#666", 
                  display: "block", 
                  marginTop: "5px",
                  fontSize: "0.9rem"
                }}>
                  Password must be at least 6 characters long
                </small>
              </div>
              
              <div style={{ marginBottom: "20px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "600",
                  color: "#555"
                }}>
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={adminData.confirmPassword}
                  onChange={handleChange}
                  style={{ width: "100%" }}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Admin Permissions */}
            <div style={{ 
              background: "#f8f9fa", 
              padding: "20px", 
              borderRadius: "10px",
              marginBottom: "30px"
            }}>
              <h4 style={{ 
                marginBottom: "15px", 
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}>
                <span style={{ 
                  background: "#dc3545", 
                  color: "white", 
                  width: "30px", 
                  height: "30px", 
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.2rem"
                }}>
                  ⚡
                </span>
                Admin Permissions
              </h4>
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
                gap: "10px" 
              }}>
                <div style={{ 
                  background: "white", 
                  padding: "15px", 
                  borderRadius: "8px",
                  border: "1px solid #e9ecef"
                }}>
                  <strong>🔐 Full System Access</strong>
                  <p style={{ margin: "5px 0 0", color: "#666", fontSize: "0.9rem" }}>
                    Complete control over all features
                  </p>
                </div>
                <div style={{ 
                  background: "white", 
                  padding: "15px", 
                  borderRadius: "8px",
                  border: "1px solid #e9ecef"
                }}>
                  <strong>👥 User Management</strong>
                  <p style={{ margin: "5px 0 0", color: "#666", fontSize: "0.9rem" }}>
                    Create, edit, and delete users
                  </p>
                </div>
                <div style={{ 
                  background: "white", 
                  padding: "15px", 
                  borderRadius: "8px",
                  border: "1px solid #e9ecef"
                }}>
                  <strong>📊 Analytics Access</strong>
                  <p style={{ margin: "5px 0 0", color: "#666", fontSize: "0.9rem" }}>
                    View system statistics and reports
                  </p>
                </div>
                <div style={{ 
                  background: "white", 
                  padding: "15px", 
                  borderRadius: "8px",
                  border: "1px solid #e9ecef"
                }}>
                  <strong>⚙️ System Settings</strong>
                  <p style={{ margin: "5px 0 0", color: "#666", fontSize: "0.9rem" }}>
                    Configure system parameters
                  </p>
                </div>
              </div>
            </div>
            
            {/* Form Actions */}
            <div style={{ display: "flex", gap: "15px" }}>
              <button
                type="submit"
                disabled={loading}
                style={{ 
                  flex: 2, 
                  padding: "15px 20px",
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px"
                }}
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating Admin...
                  </>
                ) : (
                  <>
                    <span style={{ fontSize: "1.2rem" }}>✓</span>
                    Create Admin Account
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate("/admin")}
                disabled={loading}
                style={{ 
                  background: "#6c757d", 
                  flex: 1, 
                  padding: "15px 20px"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
        
        {/* Important Notes */}
        <div style={{ 
          background: "#fff3cd", 
          padding: "20px", 
          borderRadius: "10px",
          border: "1px solid #ffeaa7"
        }}>
          <h4 style={{ 
            marginBottom: "10px", 
            color: "#856404",
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <span style={{ fontSize: "1.2rem" }}>⚠️</span>
            Important Notes
          </h4>
          <ul style={{ 
            color: "#856404", 
            margin: "0", 
            paddingLeft: "20px",
            fontSize: "0.95rem"
          }}>
            <li>Admin accounts have <strong>full system access</strong></li>
            <li>Keep admin credentials secure and confidential</li>
            <li>Each admin should use a <strong>unique email address</strong></li>
            <li>Regularly review and audit admin accounts</li>
            <li>Admins can create other admin accounts</li>
            <li>Default admin account cannot be deleted</li>
          </ul>
        </div>
        
        {/* Quick Links */}
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <p style={{ color: "#666", marginBottom: "15px" }}>
            Need to manage existing users?
          </p>
          <button 
            onClick={() => navigate("/manage-users")}
            style={{ 
              background: "transparent", 
              color: "#007bff",
              border: "2px solid #007bff"
            }}
          >
            👥 Go to User Management
          </button>
        </div>
      </div>
    </div>
  );
}