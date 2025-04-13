import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import { RouteActions } from "./routeActions"
import './info.css';

// stolen from create.js will need to change
import { storage } from "../config/firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import "./create.css"

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
  const [color, setColor] = useState("");
  
  /* time stamp information */
  const now = new Date(); 
  const timestamp = now.toLocaleString(); 
  const navigate = useNavigate();

  /* submitting a route + updating route */
  const { onSubmitRoute, onUpdateRoute } = RouteActions(); 

  const location = useLocation();
//   const imageUrl = location.state?.imageObject;
  // const imagePath = location.state?.imagePath;
  const placeholder_image = 'https://firebasestorage.googleapis.com/v0/b/router-ae6e4.firebasestorage.app/o/images%2Fplaceholder_image.jpg?alt=media&token=25740749-3e60-4b56-9767-956e44f6c459'
  /* did we come from drafts? */ 
  const isEditing = location.state?.isEditing;
  const id = location.state?.id;
  const routeData = location.state?.routeData;

  const onSaveDraft = async (e) => {
    e.preventDefault();
    
    try {
      //updates a route if they came from drafts
      if (isEditing) {
        await onUpdateRoute({ id, name: routeName, grade, incline, description, notes, timestamp, imagePath, comments: routeData.comments, coordinates: routeData.coordinates, wall: routeData.wall, color: routeData.color});
        navigate("/drafts")
        alert("Route updated to in drafts!");
      } else { //creates a new route if making it for the first time
        await onSubmitRoute({ name: routeName, grade, incline, description, notes, timestamp, imagePath, comments: [], coordinates, wall, color});
        alert("Route added to drafts!"); 
      }
    } catch(error) { 
      console.error("Error with saving route to draft :(", error); 
      alert("Failed to save the route. "); 
    }
  };

  // certain colors for certain grades. **SOme of these colors might not work?
  const gradeToColor = {
    V1: "#FFFF00", //yelow
    V2: "#FF0000", //red
    V3: "#008000",  //green
    V4: "#A020F0", //purple
    V5: "#FFA500", //orange
    V6: "#000000", //black
    V7: "#0000FF",  //blue
    V8: "#FFC0CB", //pink
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


  // AC: get rid of this 
  const prevPage = () => {
    if (!isEditing) {
      navigate('/create', { state: 
        {
        //   imageObject: imageUrl, 
          imagePath: imagePath, 
          isEditing: true, 
        }
      }); 
    } else {
      navigate('/drafts'); 
    }
  }; 


  const nextPage = () => { 
    navigate('/annotate', { state: 
      { 
        isFromDrafts: isEditing,
        routeData,
        routeName,
        grade,
        incline,
        description, 
        notes, 
        timestamp, 
        imagePath, 
        comments:[],
        coordinates,
        wall,
        color
      }
    }); 
  }; 



/* 
UPLOADING PHOTO  
*/ 
// image selected by the "choose file" button 
const [imageUpload, setImageUpload] = useState(null);
// image object used to display on screen once image is selected
const [image, setImage] = useState(placeholder_image);
// path of the image to save to firestore
const [imagePath, setImagePath] = useState("");
const [isUploaded, setIsUploaded] = useState(false);
// const navigate = useNavigate();



const uploadImage = () => {
    if (!imageUpload) {
        console.error("No image selected");
        return;
    }

    const originalName = imageUpload.name;

    // after last . – something like .jpeg
    const extension = originalName.substring(originalName.lastIndexOf('.'));

    // from 0 to . – initial name 
    const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
    
    const uniqueImageName = `${baseName}_${v4()}${extension}`;
    

    const imageRef = ref(storage, `images/${uniqueImageName}`);
    const metadata = {
        contentType: imageUpload.type || "image/jpeg",
    };

    uploadBytes(imageRef, imageUpload, metadata)
        .then(() => getDownloadURL(imageRef))
        .then((url) => {
            setImage(url); // https://firebasestorage.googleapis.com/v0/b/router-ae6e4.firebasestorage.app/o/images%2FIMG_4460_ded06abb-e74f-48e2-8f9e-cd8cde7be519.jpeg?alt=media&token=de759ed2-be81-4066-b6dd-76e93457b911
            setImagePath(`images/${uniqueImageName}`); // images/IMG_4460_ded06abb-e74f-48e2-8f9e-cd8cde7be519.jpeg
            setIsUploaded(true);
        })
        .catch((error) => {
            console.error("Upload failed:", error);
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
              onClick = {() => {
                setGrade(gradeLabel);
                setColor(gradeToColor[gradeLabel] || "#000");}}
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
    

    <div className = 'image-part'>
        <input type="file" id = "fileInput" accept = 'image/*' onChange={(event) => {setImageUpload(event.target.files[0])}} style = {{display: 'none'}} /> 
        <label htmlFor = 'fileInput'>
            <img src = {image || placeholder_image} style={{ cursor: 'pointer' }} alt = "Click to upload " className = "uploaded-image" />
        </label>
    </div>

      
  </div>

  <div className = 'button-row'>
      <div className = 'button-left'>
        <button type = 'button' className = 'navigate-button' onClick={prevPage} > Back </button>
      </div>
      <div className = 'button-right'>
        <button type = 'button' className = 'navigate-button'  onClick={nextPage} > Next </button>
      </div>
  </div>

  </div>

  

);
};

export default Info;




// import { useEffect, useState } from "react";
// import { storage } from "../config/firebase";
// import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
// import { v4 } from "uuid";
// import { useNavigate, useLocation } from 'react-router-dom';
// import "./create.css"
// import { RouteActions } from "./routeActions"


// const Upload = () => {


//     // image selected by the "choose file" button 
//     const [imageUpload, setImageUpload] = useState(null);
//     // image object used to display on screen once image is selected
//     const [image, setImage] = useState(null);
//     // path of the image to save to firestore
//     const [imagePath, setImagePath] = useState("");
//     const [isUploaded, setIsUploaded] = useState(false);
//     const navigate = useNavigate();



//     const uploadImage = () => {
//         if (!imageUpload) {
//             console.error("No image selected");
//             return;
//         }
    
//         const originalName = imageUpload.name;

//         // after last . – something like .jpeg
//         const extension = originalName.substring(originalName.lastIndexOf('.'));

//         // from 0 to . – initial name 
//         const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
       
//         const uniqueImageName = `${baseName}_${v4()}${extension}`;
        
    
//         const imageRef = ref(storage, `images/${uniqueImageName}`);
//         const metadata = {
//             contentType: imageUpload.type || "image/jpeg",
//         };
    
//         uploadBytes(imageRef, imageUpload, metadata)
//             .then(() => getDownloadURL(imageRef))
//             .then((url) => {
//                 setImage(url);
//                 setImagePath(`images/${uniqueImageName}`);
//                 setIsUploaded(true);
//             })
//             .catch((error) => {
//                 console.error("Upload failed:", error);
//             });
//     };
    
//     const nextPage = () => {
//         navigate('/info', { state: 
//             { 
//                 imageObject : image,
//                 imagePath : imagePath,
//                 isEditing : false,
//             } 
//         }); // Pass as an object
//     };



//     return (
//         <div>
//             <input type="file" onChange={(event) => {setImageUpload(event.target.files[0])}}/>
//             <button className="create-button" onClick={uploadImage}>Upload Image</button>
//             <img src={image}/>
//             <button className="create-button" onClick={nextPage} disabled={!isUploaded}>Next</button>
//         </div>
//     );
// };
// export default Upload;
