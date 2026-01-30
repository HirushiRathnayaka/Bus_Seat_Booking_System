import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookingApi";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/main.css";

export default function BookingForm() {
  const { state } = useLocation();
  const nav = useNavigate();
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.firstName ? `${user.firstName} ${user.lastName}` : "");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!name.trim() || !phone.trim()) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const bookingData = {
        passengerName: name,
        phoneNumber: phone,
        email: email,
        seatId: state.seat.id,
        busId: state.busId,
        userId: user?.id
      };

      await createBooking(bookingData);
      nav("/success");
    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.message || 
        "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h2>Confirm Booking</h2>
      
      {state?.seat && (
        <div style={{ 
          background: "#f8f9fa", 
          padding: "20px", 
          borderRadius: "10px", 
          marginBottom: "20px" 
        }}>
          <h3>Booking Summary</h3>
          <p><strong>Selected Seat:</strong> {state.seat.seatNumber}</p>
          <p><strong>Bus:</strong> BUS{state.busId}</p>
        </div>
      )}
      
      {error && (
        <div style={{ 
          background: "#fee", 
          color: "#dc3545", 
          padding: "15px", 
          borderRadius: "10px", 
          marginBottom: "20px" 
        }}>
          {error}
        </div>
      )}
      
      <div style={{ maxWidth: "500px", margin: "0 auto" }}>
        <input 
          placeholder="Passenger Name *" 
          value={name}
          onChange={e => setName(e.target.value)} 
          required
        />
        
        <input 
          placeholder="Phone Number *" 
          value={phone}
          onChange={e => setPhone(e.target.value)} 
          type="tel"
          required
        />
        
        <input 
          placeholder="Email" 
          value={email}
          onChange={e => setEmail(e.target.value)} 
          type="email"
        />
        
        <button 
          onClick={submit} 
          disabled={loading}
          style={{ width: "100%", marginTop: "10px" }}
        >
          {loading ? "Processing..." : "Confirm Booking"}
        </button>
      </div>
      
      <div style={{ marginTop: "30px", textAlign: "center" }}>
        <button onClick={() => nav(-1)} style={{ background: "#6c757d" }}>
          Back to Seat Selection
        </button>
      </div>
    </div>
  );
}