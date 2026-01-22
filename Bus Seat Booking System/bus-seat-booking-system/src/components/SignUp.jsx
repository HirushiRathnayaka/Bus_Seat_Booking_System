import React, { useState } from "react";

function Signup({ onSignup}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword]= useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handlesubmit = (e) => {
        e.preventDefault();
        if (!name || !email || !password){
            alert("please fill all fields");
            return;
        }

        if (password !== confirmPassword){
            alert("Password do not match");
            return;
        }

        onSignup({ name, email, password});
        alert("Signup successfull");

        setEmail("");
        setName("");
        setPassword("");
        setConfirmPassword("");
    };

return(
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
        <h2>SignUp</h2>
        <form onSubmit={handlesubmit}>
            <div style={{ marginBottom: "10px"}}>
                <label>Name:</label>
                <input
                   typle="text"
                   value={name}
                   onChange={(e) => setName(e.target.value)}
                   placeholder="Enter your name"
                />
            </div>
            <div style={{ marginBottom: "10px"}}>
                <label>Email:</label>
                <input
                   typle="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="Enter your email"
                />
            </div>
            <div style={{ marginBottom: "10px"}}>
                <label>Password:</label>
                <input
                   typle="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Enter your password"
                />
            </div>    
                <div style={{ marginBottom: "10px"}}>
                <label>Confirm Password:</label>
                <input
                   typle="password"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   placeholder="Re-Enter your password"
                />
            </div>
            
            <button type="submit">Signup</button>
        </form>
    </div>

);

}

export default Signup;