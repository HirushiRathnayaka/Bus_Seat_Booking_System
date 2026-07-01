import { useNavigate } from "react-router-dom";
import "../styles/main.css";

export default function BookingSuccess() {
  const navigate = useNavigate();

  return (
    <div className="page" style={{ textAlign: "center" }}>
      <div style={{ 
        background: "#d4edda", 
        padding: "40px", 
        borderRadius: "15px",
        border: "1px solid #c3e6cb"
      }}>
        <h1 style={{ color: "#155724" }}>✅ Booking Successful!</h1>
        <p style={{ fontSize: "1.2rem", marginTop: "20px", color: "#155724" }}>
          Your seat has been successfully booked.
        </p>
        <p style={{ marginTop: "10px", color: "#155724" }}>
          You will receive a confirmation email shortly.
        </p>
        
        <div style={{ marginTop: "40px" }}>
          <p><strong>Booking ID:</strong> BKG{Date.now().toString().slice(-6)}</p>
          <p><strong>Status:</strong> Confirmed</p>
        </div>
        
        <div style={{ marginTop: "40px" }}>
          <button onClick={() => navigate("/home")} style={{ marginRight: "10px" }}>
            Book Another Seat
          </button>
          <button onClick={() => navigate("/admin")} style={{ background: "#6c757d" }}>
            View All Bookings
          </button>
        </div>
      </div>
    </div>
  );
}