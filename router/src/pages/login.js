import { Auth } from "../components/auth";
import { useState, useEffect } from "react";
import React from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";

const Login = () => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user ? user.email : null);
        });

        return () => unsubscribe();
    }, []);
    
    return (<div className="App">
        {currentUser !== "" && <h1> Current User: {currentUser} </h1>}
        {currentUser === "" && <h1> Sign in! </h1>}
        <Auth setCurrentUser={setCurrentUser} />
        <hr/>
      </div>);
};
export default Login;
