import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../api/bookingApi";
import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/BookingForm.css";


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
        seat:{ id: state.seat.id },
        bus:  { id: state.busId },
        user: user?.id ? { id: user.id } : null
      };

      console.log("bookingData =>", bookingData);

      const res = await createBooking(bookingData);
      nav("/ticket", { state: { ticket: res.data } });

    } catch (err) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message || 
        "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="page bookingPage">
    <h2 className="bookingTitle">Confirm Booking</h2>

    {state?.seat && (
      <div className="bookingSummaryWhite">
        <h3 className="bookingSummaryTitle">Booking Summary</h3>
        <div className="bookingSummaryGrid">
          <p><strong>Selected Seat:</strong> {state.seat.seatNumber}</p>
          <p><strong>Bus:</strong> BUS{state.busId}</p>
        </div>
      </div>
    )}

    {error && (
      <div className="bookingErrorCard">
        {error}
      </div>
    )}

    <div className="bookingFormCard">
      <div className="bookingFormGrid">
        <input
          className="bookingInput"
          placeholder="Passenger Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          className="bookingInput"
          placeholder="Phone Number *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          required
        />

        <input
          className="bookingInput bookingInputFull"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />
      </div>

      <button
        className="btn-primary bookingBtnFull"
        onClick={submit}
        disabled={loading}
        type="button"
      >
        {loading ? "Processing..." : "Confirm Booking"}
      </button>
    </div>

    <div className="bookingFooter">
      <button
        className="btn-ghost"
        onClick={() => nav(-1)}
        type="button"
      >
        Back to Seat Selection
      </button>
    </div>
  </div>
);

}