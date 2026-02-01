import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav>
      <button onClick={() => navigate("/login")}>User Login</button>

      {/* Admin Login button */}
      <button onClick={() => navigate("/admin/login")}>
        Admin Login
      </button>
    </nav>
  );
}
