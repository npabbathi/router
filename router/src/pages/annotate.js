import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "./annotate.css"
import { Stage, Layer, Text, Circle, Image} from "react-konva";
import useImage from 'use-image';
import { v4 as uuidv4 } from 'uuid';

import { storage } from "../config/firebase";
import { ref, uploadBytes, listAll, getDownloadURL, uploadString} from "firebase/storage";


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

    /* managing annotations */
    const [annotations, setAnnotations] = useState([]);  
    // track current annotation type (circle/text)
    const [currentAnnotation, setCurrentAnnotation] = useState(null); 
     // text for annotation
    const [text, setText] = useState(""); 

    const imageUrl = location.state?.imageObject;
    const [image, status] = useImage(imageUrl);
    console.log("Image status:", status);
    console.log("Image object:", image);

    const stageRef = useRef(null);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;


    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Delete" && selectedId) {
                deleteAnnotation(selectedId);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedId, annotations]);


    const handleStageClick = (e) => {
        const stage = e.target.getStage();
        const mousePos = stage.getPointerPosition();
    
        if (currentAnnotation === 'circle') {
            setAnnotations([
                ...annotations,
                {
                    id: uuidv4(),
                    type: 'circle',
                    x: mousePos.x,
                    y: mousePos.y,
                    radius: 20,
                    fill: 'red',
                    draggable: true,
                }
            ]);
        } else if (currentAnnotation === 'text') {
            setAnnotations([
                ...annotations,
                {
                    id: uuidv4(),
                    type: 'text',
                    x: mousePos.x,
                    y: mousePos.y,
                    text: text,
                    draggable: true,
                }
            ]);
            setText(""); 
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

    const deleteAnnotation = (id) => {
        const updated = annotations.filter(a => a.id !== id);
        setAnnotations(updated);
        if (selectedId === id) {
            setSelectedId(null);
        }
    };

    const nextPage = () =>{
        // const uri = stageRef.current.toDataURL();
        // const fileName = `annotations/${Date.now()}.png`;
        // const imageRef = ref(storage, fileName);  
        // console.log("URI: \n", uri); 
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
                imagePath: imagePath, 
                comments:[],
                coordinates,
                wall,
                color
            }
        });
    }


    const uploadImage = async () => {
        if (status !== 'loaded') {
            console.warn("Image not fully loaded yet!");
            return;
        }

        
        await new Promise((res) => setTimeout(res, 100));
        const uri = stageRef.current.toDataURL();  
        console.log(stageRef.current); 
        console.log("URI: \n", uri); 
        

        const baseName = "annotated_image";
        const extension = ".png";
        const uniqueImageName = `${baseName}_${uuidv4()}${extension}`;
    
        const imagePath = `images/${uniqueImageName}`;
        const imageRef = ref(storage, imagePath);
        console.log("IMAGE PATH: \n", imagePath); 
        const metadata = {
            contentType: "image/png",
        };
        console.log("ANNOTATIONS: \n", annotations); 
    
        // try {
            uploadString(imageRef, uri, 'data_url', metadata);
            const downloadURL = await getDownloadURL(imageRef);
            image = downloadURL; 

            console.log("Image URL:", downloadURL);
            console.log("Image Path:", imagePath);
            console.log("I'M RIGHT HERE\n"); 
    
        // } catch (error) {
        //     console.error("Error uploading canvas image:", error);
        // }
    };




    return (
        <div>
            <div className="picture">
            <Stage width={window.innerWidth} height={window.innerHeight} onClick={handleStageClick} ref={stageRef}>
                <Layer>
                    <Image
                    image={image}
                    width={window.innerWidth}
                    height={window.innerHeight}
                    // onClick={handleStageClick}
                    onLoad={() => setIsImageLoaded(true)}
                    
                    />
                    
                    
                    {annotations.map((annotation, index) => {
                        if (annotation.type === 'circle') {
                            return (
                                <Circle
                                    key={annotation.id}
                                    x={annotation.x}
                                    y={annotation.y}
                                    radius={annotation.radius}
                                    fill={annotation.fill}
                                    draggable
                                    onClick={() => setSelectedId(annotation.id)}
                                    onDragEnd={(e) => {
                                        const updated = annotations.map(a =>
                                            a.id === annotation.id
                                                ? { ...a, x: e.target.x(), y: e.target.y() }
                                                : a
                                        );
                                        setAnnotations(updated);
                                    }}
                                    // onDblClick={() => deleteAnnotation(annotation.id)}
                                />
                            );
                        } else if (annotation.type === 'text') {
                            return (
                                <Text
                                    key={annotation.id}
                                    x={annotation.x}
                                    y={annotation.y}
                                    text={annotation.text}
                                    fontSize={18}
                                    fill="black"
                                    draggable
                                    onClick={() => setSelectedId(annotation.id)}
                                    onDblClick={() => {
                                        const newText = prompt("Edit text:", annotation.text);
                                        if (newText !== null) {
                                            const updated = annotations.map(a =>
                                                a.id === annotation.id ? { ...a, text: newText } : a
                                            );
                                            setAnnotations(updated);
                                        }
                                    }}
                                    onDragEnd={(e) => {
                                        const updated = annotations.map(a =>
                                            a.id === annotation.id
                                                ? { ...a, x: e.target.x(), y: e.target.y() }
                                                : a
                                        );
                                        setAnnotations(updated);
                                    }}
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
                    <button type="button" className="navigate-button" disabled={status !== "loaded"} onClick={nextPage}> Next </button>
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

                <button className="create-button" onClick={uploadImage}> Finish Annotation </button>
    
            </div>
        </div>
    );
};

export default Annotate;