import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';


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
  const navigate = useNavigate();

  const { onSubmitRoute, onUpdateRoute } = RouteActions(); 


  const location = useLocation();
  const imageUrl = location.state?.imageObject;
  const imagePath = location.state?.imagePath;

  // if user is brought to this page from the edit button in drafts, these values will be populated. isEditing will be false if they come from create, otherwise true if they come from drafts
  const isEditing = location.state?.isEditing;
  const id = location.state?.id;
  const routeData = location.state?.routeData;

  const onSaveDraft = async (e) => {
    e.preventDefault();
    
    try {
      //updates a route if they came from drafts
      if (isEditing) {
        await onUpdateRoute({ id, name: routeName, grade, incline, description, notes, timestamp, imagePath, comments: routeData.comments});
        navigate("/drafts")
        alert("Route updated to in drafts!");
      } else { //creates a new route if making it for the first time
        await onSubmitRoute({ name: routeName, grade, incline, description, notes, timestamp, imagePath, comments: []});
        alert("Route added to drafts!"); 
      }
    } catch(error) { 
      console.error("Error with saving route to draft :(", error); 
      alert("Failed to save the route. "); 
    }
  };

  // if the user came from draft, load the previous draft data.
  useEffect(() => {
    if (isEditing) {
      //set states to previous data
      setRouteName(routeData.name);
      setGrade(routeData.grade);
      setIncline(routeData.incline);
      setDesc(routeData.description);
      setNotes(routeData.notes)
    }
  }, []);


return (
  <div className = "container">
    
    
    <form onSubmit = {onSaveDraft} className = "form-part" > 
    <h1 className = "title"> Insert Route Information </h1>
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
    
    {imageUrl && 
    ( <div className = 'image-part'>
      <img src = {imageUrl} alt = "Uploaded" className = "uploaded-image" />
      </div>
      )}
  </div>

);
};

export default Info;

