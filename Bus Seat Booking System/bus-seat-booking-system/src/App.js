import React, { useState } from "react";
import Home from "./components/Home";
import Signup from "./components/SignUp";
import Signin from "./components/SignIn";
import SeatSelection from "./components/SeatSelection";

function App(){
    //const [showSignUp, setShowSignup] = useState(false);
    //const [ShowSignin, setShowSignin] = useState(false);
    const [page, setPage] = useState("home");
    const [users, setUsers] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleShowSignup = ()=> {
      setPage("signup");
    }

    const handleShowSignin =()=>{
      setPage("signin");
    }


    const handleSignup = (user) => {
      setUsers([...users, user]);
      console.log("Registered users:" , user);
      setPage("signin");
    };

    const handleSignin = (loginUser) => {
      const match = users.find(
        (u) => u.email === loginUser.email && u.password === loginUser.password
      );
      if (match) {
        setIsLoggedIn(true);
        alert("login successfull");
        setPage("home");
      }
      else{
        alert("Invalid email or password");
      }
    };




  return(
    <div >
      {page === "home" && (
       
        <Home 
         onRegisterClick= {handleShowSignup}
         onLoginClick= {handleShowSignin}
         isLoggedIn={isLoggedIn && <SeatSelection/>}
        />

      )}
        {page === "signup" && <Signup onSignup={handleSignup}/>}
        {page === "signin" && <Signin onSignin={handleSignin}/>}
        
      
    </div>

    
    
  );
}

export default App;