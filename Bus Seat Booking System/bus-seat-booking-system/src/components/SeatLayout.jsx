import Seat from "./Seat";
import "../styles/seat.css";

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

  const sortedSeats = [...seats].sort((a, b) =>
    String(a.id).localeCompare(String(b.id), undefined, { numeric: true })
  );

  const renderSeats2x2 = () => {
    const out = [];
    for (let i = 0; i < sortedSeats.length; i++) {
      // add seat
      const s = sortedSeats[i];
      out.push(
        <Seat 
          key={s.id} 
          seat={s} 
          select={select} 
          selected={selectedSeat && selectedSeat.id === s.id}
        />
  );

  const posInRow = (i % 4); // 0,1,2,3
      if (posInRow === 1) {
        out.push(<div key={`aisle-${i}`} className="aisle" aria-hidden="true" />);
      }
    }
    return out;
  };

  return <div className="seat-grid seat-grid--2x2">{renderSeats2x2()}</div>;
}