import React, { useState } from "react";
import { useLocation } from 'react-router-dom';


import { RouteActions } from "./routeActions"
import './info.css';

const Info = () => {

  /* route information here */
  const [routeName, setRouteName] = useState("My New Route");
  const [grade, setGrade] = useState(""); 
  const [incline, setIncline] = useState(0);
  const [description, setDesc] = useState(""); 
  const [notes, setNotes] = useState("");
  const now = new Date(); 
  const timestamp = now.toLocaleString(); 

  const { onSubmitRoute } = RouteActions(); 


  const location = useLocation();
  const imageUrl = location.state?.image;

const onSaveDraft = async (e) => {
  e.preventDefault();
  
  try {
    await onSubmitRoute({ name: routeName, grade, incline, description, notes, timestamp});
    alert("Route saved to drafts!"); 
  } catch(error) { 
    console.error("Error with saving route to draft :(", error); 
    alert("Failed to save the route. "); 
  }
};


return (
  <div className = "container">
    <h1 className = "title">Create Route</h1>
    <form onSubmit = {onSaveDraft}> 
      <div className = "form-group">
        <label htmlFor = "routeName">Route Name</label>
        <input 
          id="routeName" type = "text" value = {routeName}
          placeholder="Enter route name"
          onChange={(e) => setRouteName(e.target.value)} 
          required
        />
      </div>
      
      <div className = "form-group">
        <label htmlFor = "grade">Grade</label>
        <div className = "grade-buttons">
          {Array.from({ length: 8 }, (_, i) => `V${i + 1}`).map((gradeLabel) => (
            <button 
              key = {gradeLabel}
              type = "button"
              onClick = {() => setGrade(gradeLabel)} 
              className = {grade === gradeLabel ? "grade-button selected" : "grade-button"}
            >
              {gradeLabel}
            </button>
          ))}
        </div>
      </div>
      
      <div className = "form-group incline-group">
        <label htmlFor = "incline">Wall Incline</label>
        <input id = "inclineSlider" type = "range" min = "0" max = "180" value = {incline}
          onChange={(e) => setIncline(Number(e.target.value))}
        />
        <input  id = "incline" type = "number"value = {incline}
          onChange = {(e) => setIncline(Number(e.target.value))}
        />
      </div>

      <div className = "form-group">
        <label htmlFor = "description">Description</label>
        <textarea value = {description} onChange = {(e) => setDesc(e.target.value)} 
          placeholder="Enter route information."
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor = "notes">Additional Notes</label>
        <textarea value = {notes} onChange={(e) => setNotes(e.target.value)} 
          placeholder = "Extra notes (safety, concerns, etc.)"
          required
        />
      </div>
      <input type = "submit" value="Save to Drafts" className="submit-button"/>
    </form>
    
    {imageUrl && <img src = {imageUrl} alt = "Uploaded" className = "uploaded-image" />}
  </div>
);
};

export default Info;


