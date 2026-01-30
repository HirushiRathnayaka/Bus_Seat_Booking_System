import { useState, useContext } from "react";
import { login } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function SignIn() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await login(credentials);
      loginUser(data);
      navigate("/home"); // redirect to home after login
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2>Sign In</h2>
        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input name="username" placeholder="Username" value={credentials.username} onChange={handleChange} required/>
          <input name="password" type="password" placeholder="Password" value={credentials.password} onChange={handleChange} required/>

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p>
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </div>
    </div>
  );
}
