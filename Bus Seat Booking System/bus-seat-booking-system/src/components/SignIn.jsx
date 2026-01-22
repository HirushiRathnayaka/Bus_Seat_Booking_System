import React, { useState } from "react";

function Signin ({ onSignin}){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handlesubmit = (e) => {
        e.preventDefault();
        if (!email || !password){
            alert("please fill all fields");
            return;
        }

        onSignin({email, password});
        alert("Signin successful");

        setEmail("");
        setPassword("");
    };


    return(
        <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
            <h2>SignIn</h2>
            <form onSubmit={handlesubmit}>
                <div style={{ marginBottom: "10px"}}>
                    <label>Email : </label>
                    <input
                       type="email"
                       value={email}
                       onChange={(e) => setEmail(e.target.value)}
                       placeholder="Enter your email"
                    />
                </div>
                <div style={{ marginBottom: "10px"}}>
                    <label>Password : </label>
                    <input
                       type="password"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       placeholder="Enter your password"
                    />
                </div>
                <button type ="submit"> SignIn </button>

            </form>
        </div>

    );
}


export default Signin;