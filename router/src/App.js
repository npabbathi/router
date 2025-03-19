import './App.css';
import { Auth } from "./components/auth";
import { auth } from "./config/firebase";
import { useState } from "react";

function App() {

  const [currentUser, setCurrentUser] = useState("");

  return (
    <div className="App">
      <h1> Current User: {currentUser} </h1>
      <Auth setCurrentUser={setCurrentUser}/>
    </div>
  );
}

export default App;
