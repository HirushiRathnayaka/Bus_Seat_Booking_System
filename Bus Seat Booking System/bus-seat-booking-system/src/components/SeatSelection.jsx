import React from "react";

function SeatSelection(){
    const seats = [
        { number: "A1", booked: false },
        { number: "A2", booked: true },
        { number: "B1", booked: false },
        { number: "B2", booked: true },
    ];

    return (
        <div>
            <h2>Select Your Seat</h2>
            <div style={{display: "flex", gap: "10px"}}>
                {seats.map(seat => (
                    <button
                    key={seat.number}
                    disabled={seat.booked}
                    style={{
                        backgroundColor: seat.booked? "red" : "green",
                        color: "white",
                        padding: "10px"
                    }}
                    >
                        {seat.number}

                    </button>
                ) 

                )}

            </div>
        </div>
    );
}

export default SeatSelection;