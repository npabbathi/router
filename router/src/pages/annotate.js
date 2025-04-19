import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./annotate.css"
import { Stage, Layer, Text, Circle, Image} from "react-konva";
import useImage from 'use-image';
import { v4 as uuidv4 } from 'uuid';

import { storage } from "../config/firebase";
import { ref, uploadBytes, listAll, getDownloadURL, uploadString} from "firebase/storage";
import ReactImageAnnotate from "react-image-annotation";


// import React, { useState } from 'react';
// import React from 'react-image-annotation';
// import image from './path/to/your/image.jpg';

import html2canvas from 'html2canvas';



function ImageAnnotation() {

    const navigate = useNavigate();
    const location = useLocation();

    /* loading stuff from create to pass through to publish */
    const isFromDrafts = location.state?.isFromDrafts;
    const routeData = location.state?.routeData;
    const routeName = location.state?.routeName;
    const grade = location.state?.grade;
    const incline = location.state?.incline;
    const description = location.state?.description; 
    const notes = location.state?.notes; 
    const timestamp = location.state?.timestamp; 
    const comments = location.state?.comments;
    const coordinates = location.state?.coordinates;
    const wall = location.state?.wall;
    const color = location.state?.color;
    const id = location.state?.id;
    const image = location.state?.image; 

    /* image annotating information */
    const [annotations, setAnnotations] = useState([]);
    const [annotation, setAnnotation] = useState({});
    const annotationRef = useRef(null); // to capture annotation DOM
    const [imageURL, setURL] = useState(""); 

    const [isAnnotate, setAnnotate] = useState(false); 
    
    const onChange = (newAnnotation) => {
      setAnnotation(newAnnotation);
    };


    const nextPage = () =>{
        console.log('ANNOTATIONS: ', annotations); 
        navigate('/map', {state:
            {
                isFromDrafts,
                routeData,
                isPlacingRoute: true,
                routeName,
                grade,
                incline,
                description, 
                notes, 
                timestamp, 
                image,
                annotations, 
                comments:[],
                coordinates,
                wall,
                color,
                id, 
                annotations, // AC 
                isAnnotate
            }
        });
    }
  
    const onSubmit = (newAnnotation) => {
    //    isAnnotate = true; // AC SETTING VARIABLE
    setAnnotate(true);  
      setAnnotations([...annotations, newAnnotation]);
      setAnnotation({});
    };
  
    const uploadAnnotatedImage = async () => {
      if (annotationRef.current) {
        const canvas = await html2canvas(annotationRef.current);
        const dataUrl = canvas.toDataURL('image/png');
  
        const imageRef = ref(storage, `annotated_images/${image}`);
        await uploadBytes(imageRef, dataUrl, 'data_url');
        const url = await getDownloadURL(imageRef);
        console.log("IMAGE: ", url); 
        setURL(url); 
        
        alert("Annotated image uploaded!");
      }
    };
  
    return (
      <div>
        <div ref={annotationRef}>
          <ReactImageAnnotate
            src={image}
            alt="Annotated Image"
            annotations={annotations}
            value={annotation}
            onChange={onChange}
            onSubmit={onSubmit}
          />
        </div>
        <button onClick={uploadAnnotatedImage}>Upload Annotated Image</button>

        <div className="button-row">
            <div className="button-right">
                <button type="button" className="navigate-button"  onClick={nextPage}> Next </button>
            </div>
        </div>
      </div>
      

      
    );
  }
  
  export default ImageAnnotation;