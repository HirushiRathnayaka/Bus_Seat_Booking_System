export default function Seat({ seat, select, selected }) {
  // Handle undefined seat
  if (!seat) {
    return <div className="seat invalid">?</div>;
  }

  const isBooked = seat.booked || false;
  const seatNumber = seat.seatNumber || '?';
  
  let backgroundColor = '#28a745'; // Available - green
  if (isBooked) {
    backgroundColor = '#dc3545'; // Booked - red
  }
  if (selected) {
    backgroundColor = '#007bff'; // Selected - blue
  }

  return (
    <div
      className={`seat ${isBooked ? "booked" : ""} ${selected ? "selected" : ""}`}
      onClick={() => !isBooked && select && select(seat)}
      style={{
        backgroundColor: backgroundColor,
        color: 'white',
        cursor: isBooked ? 'not-allowed' : 'pointer',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        fontWeight: 'bold',
        margin: '5px',
        transition: 'all 0.3s ease'
      }}
    >
      {seatNumber}
    </div>
  );
}