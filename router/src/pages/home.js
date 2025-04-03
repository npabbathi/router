import { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const Welcome = () => {
  const [selectedGym, setSelectedGym] = useState("");
  const gyms = ["Austin Bouldering Project - Springdale ", "Austin, Bouldering Project – Westgate", "Crux Climbing Center", "Mesa Rim Climbind Center " ];

  const navigate = useNavigate(); 
  
  const handleSubmit = () => {
    if (selectedGym) {
        navigate("/map", {state: {gym: selectedGym}}); 
    } else {
        alert("Please select a gym."); 
    }
  }; 


  return (
    <div style={{ textAlign: "center", padding: "20px" }}>

      <h1>Welcome to Router!</h1>
      <p>Choose your bouldering gym:</p>

      <select value={selectedGym} onChange={(e) => setSelectedGym(e.target.value)}>
        <option value="" disabled>Select a gym</option>

        {gyms.map((gym, index) => (
            /* currently disabling the other options, can deal w later*/
          <option key={index} value={gym} disabled ={index >= gyms.length - 3}>{gym}</option> 
        ))}
      </select>
      {selectedGym && <p>Selected gym: {selectedGym}</p>}

      <br/>
      <button
      onClick = {handleSubmit}
        >
        Submit
        </button>
    </div>
    
  );
};

export default Welcome;