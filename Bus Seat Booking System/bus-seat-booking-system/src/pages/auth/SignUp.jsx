import { useState, useContext } from "react";
import { register } from "../../api/authApi";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "../../styles/auth.css";

export default function SignUp() {
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setUserData({ ...userData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await register(userData);
      setSuccess(`Registration successful! Welcome, ${data.username}`);
      loginUser(data); // optional auto-login
      setUserData({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: ""
      });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Backend error:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
        JSON.stringify(err.response?.data) ||
        "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <h2>Sign Up</h2>
        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input name="firstName" placeholder="First Name" value={userData.firstName} onChange={handleChange} required/>
          <input name="lastName" placeholder="Last Name" value={userData.lastName} onChange={handleChange} required/>
          <input name="username" placeholder="Username" value={userData.username} onChange={handleChange} required/>
          <input name="email" type="email" placeholder="Email" value={userData.email} onChange={handleChange} required/>
          <input name="password" type="password" placeholder="Password" value={userData.password} onChange={handleChange} required/>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p>
          Already have an account? <a href="/">Sign in</a>
        </p>
      </div>
    </div>
  );
}
