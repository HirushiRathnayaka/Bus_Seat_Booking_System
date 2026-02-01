import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAdminCreds } from "../../api/adminAuth";
import "../../styles/auth.css";
import wall from "../../assets/wall.jpg";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Call a protected admin API to verify credentials,Verify credentials by calling protected admin endpoint
      const basic = btoa(username + ":" + password);

      await axios.get("http://localhost:8083/api/admin/hello", {
        headers: { Authorization: "Basic " + basic },
      });

      // Save creds locally
      setAdminCreds(username, password);

      //go to dashboard
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Invalid admin username or password");
    }
  };

  return (
    <div 
        className="auth-page"
        style={{
        backgroundImage: `url(${wall})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    
    >
    <div className="auth-card">  
      <h2 className="auth-title">Admin Login</h2>

      <form onSubmit={handleLogin} className="auth-form">
        <input
          className="auth-input"
          placeholder="admin username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        
        <input
          className="auth-input"
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
      
        <button className="auth-btn" type="submit">
          Login
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

        <button className="auth-linkbtn" onClick={() => navigate("/login")}>
          ← Back to Sign In
        </button>
      </div>
      
    </div>
  );
}
