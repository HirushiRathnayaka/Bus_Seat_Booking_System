import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Ticket.css";

export default function Ticket() {
  const { state } = useLocation();
  const nav = useNavigate();

  const ticket = state?.ticket;

  if (!ticket) {
    return (
      <div className="ticketPage">
        <h2 className="ticketTitle">Your Ticket</h2>
        <div className="ticketCard">
          <p>No ticket data found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ticketPage">
      <h2 className="ticketTitle">Your Ticket</h2>

      <div className="ticketCard">
        <div className="ticketLine">
          <span className="ticketLabel">Ticket No:</span>
          <span className="ticketValue">{ticket.ticketNo}</span>
        </div>

        <div className="ticketLine">
          <span className="ticketLabel">Booking ID:</span>
          <span className="ticketValue">{ticket.id}</span>
        </div>

        <div className="ticketLine">
          <span className="ticketLabel">Seat:</span>
          <span className="ticketValue">{ticket.seatNumber}</span>
        </div>

        <div className="ticketLine">
          <span className="ticketLabel">Bus:</span>
          <span className="ticketValue">{ticket.busNumber}</span>
        </div>

        <div className="ticketLine">
          <span className="ticketLabel">Passenger:</span>
          <span className="ticketValue">{ticket.passengerName || "-"}</span>
        </div>
      </div>

      <div className="ticketFooter">
        <button className="btn-primary ticketBtn" onClick={() => nav("/home")} type="button">
          Back to Home
        </button>
      </div>
    </div>
  );
}
