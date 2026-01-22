import React, { useState } from "react";

function Home({ onRegisterClick, onLoginClick}) {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [open, setOpen] = useState(false);

    const cities = [ "Colombo","Galle","Kandy","Kegalle","Matara","Jaffna"];

    const handlebooking = () => {
        if(!from || !to || !date){
            alert ("Please fill all the details");
            return;
        }

        alert (`Your trip: ${from} -> ${to}, Date: ${date}`);
    }

    const iteamStyle ={
        padding:"10px",
        cursor:"pointer",
        borderBottom: "1px solid #ccc"
    };

    return(
        
            <div style={{ padding: "20px", fontFamily: "Arial" }}>
      
                <div style={{
                    display:"flex",
                    alignItems:"center",
                    justifyContent:"space-between"
                }}>

                <div
                    style={{
                        display:"flex",
                        justifyContent: "flex-start",
                        gap:"10px",
                        marginBottom: "20px",
                        
                    }}
                >
                    <div
                       onClick={() => setOpen(!open)}
                       style={{
                        fontSize: "26px",
                        cursor: "pointer",
                        marginRight: "15px",
                        zIndex: 2

                       }}
                    
                    >
                        ☰
                    </div>
                    {open && (
                        <div style={{
                            width:"250px",
                            height:"100vh",
                            backgroundColor:"#f4f4f4",
                            position: "fixed",
                            top:0,
                            left:0,
                            padding:"20px",
                            boxShadow:"2px 0 5px rgba(0,0,0,0.2)"
                        }}
                        
                        >
                            <h4>Menu</h4>
                            <ul style={{ listStyle: "none", padding:0}}>
                               <li style={iteamStyle}>LOGIN</li>

                               
                            </ul>
                        </div>
                    )}
                    
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "20px" }}>
                   <button onClick={onRegisterClick}>Register</button>
                   <button onClick={onLoginClick}>Login</button>
                </div>
                </div>
            

                <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                    <h2>Seat Reservation</h2>

                    <div style={{ marginBottom: "10px"}}>
                        <label>From:</label>
                        <input
                            type="text"
                            list="citiesFrom"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            placeholder="From city"
                        />

                        <datalist id="citiesFrom">
                            {cities.map((city,index) => (
                                <option key={index} value={city}/>
                            ))}

                        </datalist>
                    </div>

                    <div style={{ marginBottom: "10px"}}>
                        <label>To:</label>
                        <input
                            type="text"
                            list="citiesTo"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            placeholder="To city"
                        />

                        <datalist id="citiesTo">
                            {cities.map((city,index) => (
                                <option key={index} value={city}/>
                            ))}
                        </datalist>
                    </div>

                    <div style={{ marginBottom: "10px"}}>
                        <label>Date:</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            
                        />
                    </div>

                    <button onClick={handlebooking}>Book Now</button>

                </div>
            </div>

        

    );
    

}

export default Home;