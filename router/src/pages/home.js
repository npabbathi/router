import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RouterToast from "../components/toast";

const Welcome = () => {
  const [selectedGym, setSelectedGym] = useState("");
  const gyms = ["Austin Bouldering Project - Springdale ", "Austin, Bouldering Project – Westgate", "Crux Climbing Center", "Mesa Rim Climbind Center "];
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = () => {
    if (selectedGym) {
      navigate("/map", { state: { gym: selectedGym } });
    } else {
      setToastMessage("Please select a gym.");
      setToastType("danger");
      setShowToast(true);
    }
  };


  // shows toast on error or success
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);


  return (
    <div>
      {showToast && (
        <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
          <RouterToast message={toastMessage} type={toastType} />
        </div>
      )}
      <div style={{ textAlign: "center", padding: "20px" }}>

        <h1>Welcome to Router!</h1>
        <p>Choose your bouldering gym:</p>

        <select value={selectedGym} onChange={(e) => setSelectedGym(e.target.value)}>
          <option value="" disabled>Select a gym</option>

          {gyms.map((gym, index) => (
            /* currently disabling the other options, can deal w later*/
            <option key={index} value={gym} disabled={index >= gyms.length - 3}>{gym}</option>
          ))}
        </select>
        {selectedGym && <p>Selected gym: {selectedGym}</p>}

        <br />
        <button style={{ margin: "20px" }}
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>

  );
};

export default Welcome;