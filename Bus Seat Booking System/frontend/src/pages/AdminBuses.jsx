import { useEffect, useState } from "react";
import MarkSeatsModal from "./MarkSeatsModal"; 
import { getAllBuses } from "../api/busApi";

export default function AdminBuses() {
  const [buses, setBuses] = useState([]);

  
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(null);

  useEffect(() => {
    getAllBuses().then(setBuses);
  }, []);

  return (
    <div>
      <h2>Bus List</h2>

      {/* BUS TABLE */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Bus No</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {buses.map((bus) => (
            <tr key={bus.id}>
              <td>{bus.id}</td>
              <td>{bus.busNumber}</td>

              {/*  BUTTON GOES HERE */}
              <td>
                <button
                  type="button"
                  onClick={() => {
                  console.log("BUS OBJECT:", bus);
                  console.log("BUS ID:", bus?.id);

                  setSelectedBusId(bus?.id);
                  setShowSeatModal(true);
                }}
                >
                 Seat Status
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/*  MODAL RENDER GOES HERE (BOTTOM of return) */}
      {showSeatModal && selectedBusId && (
        <MarkSeatsModal
           busId={selectedBusId}
           onClose={() => setShowSeatModal(false)}
        />
    )}

    </div>
  );
}
