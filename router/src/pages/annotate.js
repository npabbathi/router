import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./annotate.css"
import { Stage, Layer, Text, Circle, Image} from "react-konva";
import useImage from 'use-image';

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase"; 





const Annotate = () => {
    
    const navigate = useNavigate();
    const location = useLocation();

    const isFromDrafts = location.state?.isFromDrafts;
    const routeData = location.state?.routeData;
    const routeName = location.state?.routeName;
    const grade = location.state?.grade;
    const incline = location.state?.incline;
    const description = location.state?.description; 
    const notes = location.state?.notes; 
    const timestamp = location.state?.timestamp; 
    const imagePath = location.state?.imagePath; 
    const comments = location.state?.comments;
    const coordinates = location.state?.coordinates;
    const wall = location.state?.wall;
    const color = location.state?.color;

    const [annotations, setAnnotations] = useState([]);  // Manage annotations (text and circles)
    const [currentAnnotation, setCurrentAnnotation] = useState(null); // Track current annotation type (circle or text)
    const [text, setText] = useState("");  // Text for annotation

    const imageUrl = location.state?.imageObject;
    // const [image] = useImage(imageUrl);
    
    const stageRef = useRef(null);

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;

    const [image, setImage] = useState("");
    // const [imagePath, setImagePath] = useState("");
    const uploadAnnotatedImage = async (dataUrl, fileName) => {
        console.log('FILE NAME: \n', fileName); 
        console.log("DATA URL: \n", dataUrl); 
        const imageRef = ref(storage, `annotated/${fileName}`);
        // await uploadString(imageRef, dataUrl, 'data_url'); // Upload base64 string
        // const downloadURL = await getDownloadURL(imageRef);
       
        // const metadata = {
        //     contentType: uploadImage.type || "image/jpeg",
        // };

    
        // uploadBytes(imageRef, imageUpload, metadata)
        //     .then(() => getDownloadURL(imageRef))
        //     .then((url) => {
        //         console.log('DOWNLOAD URL: \n', url); 
        //         setImage(url); // https://firebasestorage.googleapis.com/v0/b/router-ae6e4.firebasestorage.app/o/images%2FIMG_4460_ded06abb-e74f-48e2-8f9e-cd8cde7be519.jpeg?alt=media&token=de759ed2-be81-4066-b6dd-76e93457b911
        //         // setImagePath(`images/${uniqueImageName}`); // images/IMG_4460_ded06abb-e74f-48e2-8f9e-cd8cde7be519.jpeg
        //         // setIsUploaded(true);
        //     })
        //     .catch((error) => {
        //         console.error("Upload failed:", error);
        // });
      };


    const handleStageClick = (e) => {
        const stage = e.target.getStage();
        const mousePos = stage.getPointerPosition();

        // Depending on the current annotation type, add text or circle
        if (currentAnnotation === 'circle') {
            setAnnotations([
                ...annotations,
                {
                    type: 'circle',
                    x: mousePos.x,
                    y: mousePos.y,
                    radius: 20,
                    fill: 'red',
                }
            ]);
        } else if (currentAnnotation === 'text') {
            setAnnotations([
                ...annotations,
                {
                    type: 'text',
                    x: mousePos.x,
                    y: mousePos.y,
                    text: text,
                }
            ]);
            setText("");  // Reset text after adding
        }
    };

    const handleTextChange = (e) => {
        setText(e.target.value);  // Update text value when user types
    };

    const handleCircleAnnotation = () => {
        setCurrentAnnotation('circle');
    };

    const handleTextAnnotation = () => {
        setCurrentAnnotation('text');
    };

    const prevPage = () => {
        navigate('/create');
    };

    const nextPage = async () =>{
        const dataUrl = stageRef.current.toDataURL(); // Annotated image as base64
        const fileName = `annotated_${Date.now()}.png`;

        try { 
            const downloadURL = await uploadAnnotatedImage(dataUrl, fileName);
            console.log("Firebase Image URL:", downloadURL);

        navigate('/map', {
            state: {
              isFromDrafts,
              routeData,
              isPlacingRoute: true,
              routeName,
              grade,
              incline,
              description, 
              notes, 
              timestamp, 
              imagePath: downloadURL,
              comments: [],
              coordinates,
              wall,
              color
            }
          });
        } catch (err) {
          console.error("Upload failed:", err);
        }
      };
      


    return (
        <div>
            <div className="picture">
            <Stage ref={stageRef} width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick}>
                <Layer>
                    <Image
                    image={image}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    // onClick={handleStageClick}
                    />
                    {annotations.map((annotation, index) => {
                    if (annotation.type === 'circle') {
                        return (
                        <Circle
                            key={index}
                            x={annotation.x}
                            y={annotation.y}
                            radius={annotation.radius}
                            fill={annotation.fill}
                        />
                        );
                    } else if (annotation.type === 'text') {
                        return (
                        <Text
                            key={index}
                            x={annotation.x}
                            y={annotation.y}
                            text={annotation.text}
                            fontSize={18}
                            fill="black"
                        />
                        );
                    }
                    return null;
                    })}
                </Layer>
                </Stage>
            </div>

            <div className="button-row">
                <div className="button-left">
                    <button type="button" className="navigate-button" onClick={prevPage}> Back </button>
                </div>
                <div className="button-right">
                    <button type="button" className="navigate-button" onClick={nextPage}> Next </button>
                </div>
            </div>

            {/* Buttons for annotation types */}
            <div className="annotation-tools">
                <button onClick={handleCircleAnnotation}>Add Circle</button>
                <button onClick={handleTextAnnotation}>Add Text</button>
                {currentAnnotation === 'text' && (
                    <input
                        type="text"
                        value={text}
                        onChange={handleTextChange}
                        placeholder="Enter text"
                    />
                )}
            </div>
        </div>
    );
};

export default Annotate;
