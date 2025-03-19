import { auth } from "../config/firebase"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { useState } from "react";

export const Auth = ({setCurrentUser}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    console.log(auth?.currentUser?.email)

    const signUp = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setCurrentUser(email);
        } catch (err) {
            console.error(err)
        }
    }

    const signIn = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            setCurrentUser(email);
        } catch (err) {
            console.error(err)
        }
    }

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
            <input placeholder="Email" onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder="Password" onChange={(e) => setPassword(e.target.value)}/>
            <button onClick={signUp}> Sign Up </button>
            <button onClick={signIn}> Log In </button>
            <button onClick={logout}> Log out </button>
        </div>
    ) 
}