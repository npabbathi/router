import { auth } from "../config/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth"
import { useState, useEffect } from "react";

// This file handles the user authentication to firebase. It allows for signing up, logging in, and logging out of an account

export const Auth = ({ setCurrentUser }) => {
    //input states
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setCurrentUser(user);
                localStorage.setItem("token", "true"); 
            } else {
                setCurrentUser(null);
                localStorage.removeItem("token"); 
            }
        });
        return () => unsubscribe();
    }, [setCurrentUser]);

    /**
     * This function tries to create a user with the current email and password. if the requirements for the email/password are not met, an error is catched in the terminal
     */
    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setCurrentUser(email);
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * This function tries to log in a user with the current email and password. if the user does not exist, an error is catched in the terminal
     */
    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setCurrentUser(email);
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * Tries to log out the current user, errors if no user is logged in
     */
    const logout = async () => {
        try {
            await signOut(auth, email, password);
            setCurrentUser("");
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div>
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={signUp}> Sign Up </button>
            <button onClick={signIn}> Log In </button>
            <button onClick={logout}> Log out </button>
        </div>
    )
}

export const logout = async (navigate) => {
    try {
        await signOut(auth);
        localStorage.removeItem("token");
        navigate("/login");
    } catch (err) {
        console.error(err)
    }
}