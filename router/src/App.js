import './App.css';
import { Auth } from "./components/auth";
import Header from "./components/navbar";
import { useState } from "react";
import Router from "./components/router";
import { BrowserRouter, Route } from "react-router-dom";
import RouteProject from "./components/routeProject";

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  const [currentUser, setCurrentUser] = useState("");

  return (
    <BrowserRouter>
    <div>
      <Header/>
      <Router/>
      <div className="App">
        {currentUser !== "" && <h1> Current User: {currentUser} </h1>}
        {currentUser === "" && <h1> Sign in! </h1>}
        <Auth setCurrentUser={setCurrentUser} />
        <hr/>
        <RouteProject/>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;
