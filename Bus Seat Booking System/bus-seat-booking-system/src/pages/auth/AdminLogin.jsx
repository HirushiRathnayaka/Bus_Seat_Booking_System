import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAdminCreds } from "../../api/adminAuth";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth.css";
import wall from "../../assets/wall.jpg";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const basic = btoa(username + ":" + password);

      // ✅ verify admin credentials
      await axios.get("http://localhost:8083/api/admin/hello", {
        headers: { Authorization: "Basic " + basic },
      });

      // ✅ SAVE creds (IMPORTANT)
      setAdminCreds(username, password);

      // ✅ check saved (debug)
      console.log("SAVED:", localStorage.getItem("adminUser"), localStorage.getItem("adminPass"));

      // ✅ set AuthContext
      loginUser({ username, role: "ADMIN" });

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
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
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="auth-btn" type="submit">
            Login
          </button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="auth-linkbtn"
          onClick={() => navigate("/login")}
          type="button"
        >
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
}
