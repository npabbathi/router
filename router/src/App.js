import './App.css';
import { Auth } from "./components/auth";
import Header from "./components/navbar";
import { auth } from "./config/firebase";
import { useState } from "react";
import Router from "./components/router";
import { BrowserRouter } from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [currentUser, setCurrentUser] = useState("");

  return (
    <BrowserRouter>
    <div>
      <Header/>
      <Router/>
      <div className="App">
        <h1> Current User: {currentUser} </h1>
        <Auth setCurrentUser={setCurrentUser} />
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;
