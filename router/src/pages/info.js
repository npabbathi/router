import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import { RouteActions } from "./routeActions"
import './info.css';

const Info = () => {

  /* route information here */
  const [routeName, setRouteName] = useState("");
  const [grade, setGrade] = useState(""); 
  const [incline, setIncline] = useState(0);
  const [description, setDesc] = useState(""); 
  const [notes, setNotes] = useState("");
  const [wall, setWall] = useState("");
  const [coordinates, setCoordinates] = useState({
    x: 0,
    y: 0,
  });
  
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
        await onUpdateRoute({ id, name: routeName, grade, incline, description, notes, timestamp, imagePath, comments: routeData.comments, coordinates: routeData.coordinates, wall: routeData.wall});
        navigate("/drafts")
        alert("Route updated to in drafts!");
      } else { //creates a new route if making it for the first time
        await onSubmitRoute({ name: routeName, grade, incline, description, notes, timestamp, imagePath, comments: [], coordinates, wall});
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

  // if the user wants to go back to the file upload page, original image should still remain 
  // as of now, really useless code 
  const prevPage = () => {
    navigate('/create', { state: 
      {
        imageObject: imageUrl, 
        imagePath: imagePath, 
        isEditing: true, 
      }
    }); 
  }; 


 // will definitely need to pass more into this then just routeData. Because let's say a user is in the annotate
 // page, but then wants to go back to this page, we need to preserve everything and repopulate the information
  const nextPage = () => { 
    navigate('/annotate', { state: 
      { 
        routeData: routeData,
        // name, 
        // grade, 
        // incline,
        // description, 
        // notes, 
        // timestamp, 
        // imagePath, 
        // comments
      }
    }); 
  }; 


return (
  <div className = "outer-container"> 

  <div className = "container">
    
    
    <form onSubmit = {onSaveDraft} className = "form-part" > 
    <h1 className = "title"> INSERT ROUTE INFORMATION </h1>
      <div className = "form-group">
        <label htmlFor = "routeName">Route Name</label>
        <input 
          id="routeName" type = "text" value = {routeName}
          placeholder="Enter route name."
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

  <div className = 'button-row'>
      <div className = 'button-left'>
        <button type = 'button' className = 'navigate-button' onClick={prevPage} > Back </button>
      </div>
      <div className = 'button-right'>
        <button type = 'button' className = 'navigate-button' onClick={nextPage} > Next </button>
      </div>
    </div>

  </div>

  

);
};

export default Info;

