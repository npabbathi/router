import './App.css';
import { Auth } from "./components/auth";
import Header from "./components/navbar";
import { useState, useEffect } from "react";
import Router from "./components/router";
import { BrowserRouter } from "react-router-dom";
import RouteProject from "./components/routeProject";
import { auth } from "./config/firebase";
import { onAuthStateChanged } from "firebase/auth";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setCurrentUser(user ? user.email : null);
    });

    return () => unsubscribe();
}, []);

  return (
    <BrowserRouter>
    <div>
      <Header currentUser={currentUser} setCurrentUser={setCurrentUser}/>
      <Router/>
      {/* <div className="App">
        {currentUser !== "" && <h1> Current User: {currentUser} </h1>}
        {currentUser === "" && <h1> Sign in! </h1>}
        <Auth setCurrentUser={setCurrentUser} />
        <hr/>
        <RouteProject/>
      </div> */}
    </div>
    </BrowserRouter>
  );
}

export default App;
