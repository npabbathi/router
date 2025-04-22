import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./annotate.css"
import { Stage, Layer, Text, Circle, Image } from "react-konva";
import useImage from 'use-image';
import { v4 as uuidv4 } from 'uuid';
import ProgressBarComponent from "../components/progress";
import { storage } from "../config/firebase";
import { ref, uploadBytes, listAll, getDownloadURL, uploadString } from "firebase/storage";
import ReactImageAnnotate from "react-image-annotation";


// import React, { useState } from 'react';
// import React from 'react-image-annotation';
// import image from './path/to/your/image.jpg';

import html2canvas from 'html2canvas';



function ImageAnnotation() {
  const navigate = useNavigate();
  const location = useLocation();

  const image = location.state?.image;
  const annotationsInitial = location.state?.annotations || [];

  const [annotations, setAnnotations] = useState(annotationsInitial);
  const [annotation, setAnnotation] = useState({});
  const [scale, setScale] = useState(1); // Default zoom level
  const annotationRef = useRef();
  const [progress, setProgress] = useState(50);
  const stepLabel = "Step 2 of 3: Annotate Route";

  const onChange = (newAnnotation) => setAnnotation(newAnnotation);

  const onSubmit = (newAnnotation) => {
    //    isAnnotate = true; // AC SETTING VARIABLE
    setAnnotate(true);
    setAnnotations([...annotations, newAnnotation]);
    setAnnotation({});
  };



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
  const preselectWall = location.state?.preselectWall;


  /* image annotating information */

  const [imageURL, setURL] = useState("");

  const [isAnnotate, setAnnotate] = useState(false);


  const nextPage = () => {
    // console.log('ANNOTATIONS: ', annotations); 
    const nextRoute = preselectWall ? '/wall' : '/map';

    navigate(nextRoute, {
      state:
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
        comments: [],
        coordinates,
        wall,
        color,
        id,
        annotations, // AC 
        isAnnotate,
        preselectWall
      }
    });
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const resetZoom = () => setScale(1);

  const handleSliderChange = (e) => {
    setScale(parseFloat(e.target.value));
  };

  return (
    <div>
      <ProgressBarComponent progress={progress} stepLabel={stepLabel} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <div className="button-row annotate-button-row">
        <button type="button" disabled={true} className="create-header-button">
          <i class="fa fa-arrow-left"></i>  Back
        </button>
        <h1 className="annotate-header"><b>ANNOTATE YOUR ROUTE</b></h1>
        <button onClick={nextPage}> Next  <i class="fa fa-arrow-right"></i> </button>
      </div>
      <div className="image-annotation-wrapper">
        <div className="zoom-buttons">
          <button className="zoom-button" onClick={zoomOut}>-</button>

          <input
            type="range"
            min="0.5"
            max="3"
            step="0.1"
            value={scale}
            onChange={handleSliderChange}
            className="zoom-slider"
          />

          <button className="zoom-button" onClick={zoomIn}>+</button>

          <button className="zoom-button reset-button" onClick={resetZoom}>Reset</button>
          <span className="zoom-label">{Math.round(scale * 100)}%</span>
        </div>

        <div className="zoom-container">
          <div
            className="zoom-content"
            ref={annotationRef}
            style={{ transform: `scale(${scale})` }}
          >
            <ReactImageAnnotate
              src={image}
              alt="Annotated Image"
              annotations={annotations}
              value={annotation}
              onChange={onChange}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageAnnotation;