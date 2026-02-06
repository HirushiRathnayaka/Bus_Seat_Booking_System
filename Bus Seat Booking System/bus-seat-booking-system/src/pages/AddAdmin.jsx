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
     const response = await fetch("http://localhost:8083/api/auth/create-admin", {

  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Basic " + btoa(
      localStorage.getItem("adminUser") + ":" + localStorage.getItem("adminPass")
    ),
  },
  body: JSON.stringify(newAdmin),
});

      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create admin");
      }
      
      setSuccess(` Admin "${adminData.username}" created successfully!`);
      
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
        navigate("/admin/dashboard");
      }, 2000);
      
    } catch (err) {
      console.error("Error creating admin:", err);
      setError(err.message || "Failed to create admin. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="page add-admin-page">
      <div className="add-admin-wrap">
        {/* Header */}
        <div className="add-admin-top">
          <div>
            <h1 className="add-admin-title">
              Create New Admin
            </h1>
            <p className="add-admin-subtitle">
              Add a new administrator to the bus booking system
            </p>
          </div>

          <button
            className="btn btn-muted"
            onClick={() => navigate("/admin/dashboard")}
            type="button"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Logged in card */}
        {user?.role === "ADMIN" && (
          <div className="admin-badge-card">
            <b>Logged in as:</b> {user.username} (ADMIN)
          </div>
        )}

        {/* Alerts */}
        {error && <div className="alert alert-error"><b>Error:</b> {error}</div>}
        {success && <div className="alert alert-success"><b>Success!</b> {success}</div>}

        {/* Form Card */}
        <div className="glass-card">
          <form onSubmit={handleSubmit} className="add-admin-form">
            <div className="form-section">
              <h3 className="section-title">Admin Information</h3>

              <div className="grid-2">
                <div className="field">
                  <label>First Name </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={adminData.firstName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>

                <div className="field">
                  <label>Last Name </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={adminData.lastName}
                    onChange={handleChange}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label>Username </label>
                <input
                  type="text"
                  name="username"
                  placeholder="Choose a username"
                  value={adminData.username}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
                <small>This will be used for login</small>
              </div>

              <div className="field">
                <label>Email Address </label>
                <input
                  type="email"
                  name="email"
                  placeholder="admin@example.com"
                  value={adminData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Security Settings</h3>

              <div className="field">
                <label>Password </label>
                <input
                  type="password"
                  name="password"
                  placeholder="At least 6 characters"
                  value={adminData.password}
                  onChange={handleChange}
                  minLength={6}
                  disabled={loading}
                  required
                />
                <small>Password must be at least 6 characters long</small>
              </div>

              <div className="field">
                <label>Confirm Password </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Re-enter password"
                  value={adminData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Permissions */}
            <div className="perm-card">
              <div className="perm-title">
                <h4>Admin Permissions</h4>
              </div>

              <div className="perm-grid">
                <div className="perm-item">
                  <b> Full System Access</b>
                  <p>Complete control over all features</p>
                </div>
                <div className="perm-item">
                  <b> User Management</b>
                  <p>Create, edit, and delete users</p>
                </div>
                <div className="perm-item">
                  <b> Analytics Access</b>
                  <p>View system statistics and reports</p>
                </div>
                <div className="perm-item">
                  <b> System Settings</b>
                  <p>Configure system parameters</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="form-actions">
              <button className="btn btn-primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="loading-spinner" /> Creating Admin...
                  </>
                ) : (
                  <>✓ Create Admin Account</>
                )}
              </button>

              <button
                className="btn btn-muted"
                type="button"
                onClick={() => navigate("/admin/dashboard")}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Notes */}
        <div className="note-card">
          <h4> Important Notes</h4>
          <ul>
            <li>Admin accounts have <b>full system access</b></li>
            <li>Keep admin credentials secure and confidential</li>
            <li>Each admin should use a <b>unique email address</b></li>
            <li>Regularly review and audit admin accounts</li>
            <li>Admins can create other admin accounts</li>
            <li>Default admin account cannot be deleted</li>
          </ul>
        </div>

        {/* Quick link */}
        <div className="quick-link">
          <p>Need to manage existing users?</p>
          <button className="btn btn-outline" onClick={() => navigate("/manage-users")}>
             Go to User Management
          </button>
        </div>
      </div>
    </div>
  );
}