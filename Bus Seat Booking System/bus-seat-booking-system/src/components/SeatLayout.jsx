import Seat from "./Seat";

export default function SeatLayout({ seats, select, selectedSeat }) {
  // Handle undefined or null seats
  if (!seats || !Array.isArray(seats)) {
    return (
      <div className="seat-grid" style={{ textAlign: 'center', padding: '20px' }}>
        <p>No seats available or loading...</p>
      </div>
    );
  }

  // Handle empty seats array
  if (seats.length === 0) {
    return (
      <div className="seat-grid" style={{ textAlign: 'center', padding: '20px' }}>
        <p>No seats found for this bus.</p>
      </div>
    );
  }

  return (
    <div className="seat-grid">
      {seats.map(s => (
        <Seat 
          key={s.id} 
          seat={s} 
          select={select} 
          selected={selectedSeat && selectedSeat.id === s.id}
        />
      ))}
    </div>
  );
}