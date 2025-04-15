import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { Stage, Layer, Circle, Image as KonvaImage, Text, Group } from "react-konva";
import useImage from "use-image";
import "./wall.css";
import { RouteActions } from "./routeActions";


const Wall = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const imageUrl = params.get("image");
    const [image] = useImage(imageUrl);

    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const { getRoutesByWall, onSubmitRoute, onUpdateRoute } = RouteActions();
    const [wallName, setWallName] = useState("");
    const [wallRoutes, setWallRoutes] = useState([]);
    const [circles, setCircles] = useState([]);

    const isFromDrafts = location.state?.isFromDrafts;
    const routeData = location.state?.routeData;
    const isPlacingRoute = location.state?.isPlacingRoute || false;
    const routeName = location.state?.routeName;
    const grade = location.state?.grade;
    const incline = location.state?.incline;
    const description = location.state?.description; 
    const notes = location.state?.notes; 
    const timestamp = location.state?.timestamp; 
    const imagePath = location.state?.imagePath; 
    const comments = location.state?.comments;
    const coordinates = circles[0];
    const color = location.state?.color;
    const placingColor = isFromDrafts ? routeData?.color : color;
    const id = location.state?.id;


    // Extracts only the name of the wall. For example: "east-wall" or "fs1"
    useEffect(() => {
        if (imageUrl) {
            const parts = imageUrl.split('/');
            const fileName = parts[parts.length - 1];
            const nameWithoutExtension = fileName.split('.')[0];
            setWallName(nameWithoutExtension);
        }
    }, [imageUrl]);

    // Fetches all routes that belong to this wall
    useEffect(() => {
        const fetchRoutes = async () => {
            if (wallName) {
                const routes = await getRoutesByWall(wallName);
                setWallRoutes(routes);
            }
        };

        fetchRoutes();
    }, [wallName]);

    // Padding initializations for top and bottom
    const paddingTop = 20;
    const paddingBottom = 20;

    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setContainerSize({ width: rect.width, height: rect.height });
        }
    }, [imageUrl]);

    const scale = image
        ? Math.min(containerSize.width / image.width, (containerSize.height - paddingTop - paddingBottom) / image.height) // Adjust scale according to padding
        : 1;

    // Populating circles/routes that belong to this wall via their coordinates
    const plotRouteCircles = () => {
        return wallRoutes.map((route, idx) => {
            const { x, y } = route.coordinates || {};
            if (x && y && x !== 0 && y !== 0 && x != null && y != null) {
                const imageX = (containerSize.width - image.width * scale) / 2;
                const imageY = (containerSize.height - image.height * scale - paddingTop - paddingBottom) / 2 + paddingTop;
    
                const circleX = x * scale + imageX;
                const circleY = y * scale + imageY;
    
                const goReviewRoute = () => {
                    if (isPlacingRoute == false){
                        navigate(`/review/${route.id}`); 
                    }
                };
    
                return (
                    <Group
                        key={idx}
                        onClick={goReviewRoute}
                        {...(!isPlacingRoute && {
                            onMouseEnter: (e) => {
                              const container = e.target.getStage().container();
                              container.style.cursor = 'pointer';
                            },
                            onMouseLeave: (e) => {
                              const container = e.target.getStage().container();
                              container.style.cursor = 'default';
                            },
                        })}
                    >
                        <Circle
                            x={circleX}
                            y={circleY}
                            radius={11}
                            fill={route.color}
                            stroke="black"
                            strokeWidth={0.5}
                        />
                        <Text
                            x={circleX - 7}
                            y={circleY - 5}
                            text={route.grade}
                            fontSize={12}
                            fill="white"
                            fontStyle="bold"
                        />
                    </Group>
                );
            }
            return null;
        });
    };
    
    

    // handles resizing
    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setContainerSize({ width: rect.width, height: rect.height });
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, [imageUrl]);

    // Placing a new route on the wall
    const placeCircle = async (e) => {
        // Checks if isPlacingRoute is true
        if (!isPlacingRoute || !image) return;

        // User can't place a route with right-click. ONLY left-click permitted
        if (e.evt.button !== 0) return;
    
        // Get pointer position relative to stage
        const stage = e.target.getStage();
        const pointerPos = stage.getPointerPosition();
    
        // Calculate offsets
        const imageX = (containerSize.width - image.width * scale) / 2;
        const imageY = (containerSize.height - image.height * scale - paddingTop - paddingBottom) / 2 + paddingTop;
    
        // Convert to image-native coordinates
        const x = (pointerPos.x - imageX) / scale;
        const y = (pointerPos.y - imageY) / scale;
    
        // Save to state
        const newCircle = { x, y };
        setCircles([newCircle]);     
        
    };

    // going back to map page, in the case that the user changes their mind and doesn't want this wall.
    const prevPage = () => {
        navigate('/map', {state:
            {
                isFromDrafts,
                routeData,
                isPlacingRoute,
                routeName,
                grade,
                incline,
                description, 
                notes, 
                timestamp, 
                imagePath, 
                comments,
                coordinates,
                wall: "",
                color,
                id
            }
        });
    }

    const onFinalPlaceRoute = async (e) => {
        e.preventDefault();
        try {
            const { x, y } = circles[0]
            await onSubmitRoute({ name: routeName, grade, incline, description, notes, timestamp, imagePath, comments, coordinates: { x, y }, wall: wallName, color});
            alert("Route has been published!"); 
        } catch(error) { 
            console.error("Error with publishing route :(", error); 
            alert("Failed to publish the route. "); 
        }
    };

    const onEditingRoute = async (e) =>{
        e.preventDefault();
        try {
            const { x, y } = circles[0]
            await onUpdateRoute({id, name: routeName, grade, incline, description, notes, timestamp, imagePath, comments, coordinates: { x, y }, wall:wallName, color})
            alert("Route has been updated!")
        } catch(error){
            console.error("Error with updating route :(", error); 
            alert("Failed to update the route. "); 
        }
    };

    const toCreatePage = () => {
        navigate(`/create`);
    }

    return (
        <div>
            <div className = 'back-button-con'>
                <button type = 'button' className = 'back-button' onClick={prevPage} > Back to Map </button>
            </div>
            <h1 className="header">Select a route to review, or create your own!</h1>
            <div className="wall-con" ref={containerRef}>
                {image && (
                    <Stage
                        width={containerSize.width}
                        height={containerSize.height}
                        onClick={placeCircle}
                    >
                        <Layer>
                            {/* Scaled image with padding */}
                            <KonvaImage
                                image={image}
                                x={(containerSize.width - image.width * scale) / 2}
                                y={(containerSize.height - image.height * scale - paddingTop - paddingBottom) / 2 + paddingTop}
                                scaleX={scale}
                                scaleY={scale}
                            />

                            {/* Dynamically-size circles based on route coordinates */}
                            {plotRouteCircles()}

                            {/* Placing a route or circle */}
                            {circles.map((circle, idx) => {
                                const imageX = (containerSize.width - image.width * scale) / 2;
                                const imageY = (containerSize.height - image.height * scale - paddingTop - paddingBottom) / 2 + paddingTop;

                                return (
                                    <React.Fragment key={`new-${idx}`}>
                                        <Circle
                                            x={circle.x * scale + imageX}
                                            y={circle.y * scale + imageY}
                                            radius={11}
                                            fill={placingColor}
                                            stroke="black"
                                            strokeWidth={0.5}
                                        />
                                        <Text
                                            x={circle.x * scale + imageX - 7}
                                            y={circle.y * scale + imageY - 5}
                                            text={grade}
                                            fontSize={12}
                                            fill="white"
                                            fontStyle="bold"
                                        />
                                    </React.Fragment>
                                );
                            })}
                        </Layer>
                    </Stage>
                )}
            </div>
            {isPlacingRoute && (
                <div className='submit-button-con'>
                    <button type='button' className='submit-button' onClick={isFromDrafts ? onEditingRoute : onFinalPlaceRoute} disabled={circles.length === 0}>
                        Publish Route
                    </button>
                </div>
            )}
            {!isPlacingRoute && (
                <div className = 'create-route-button-con'>
                    <button type = 'button' className = 'create-route-button' onClick={toCreatePage}> + </button>
                </div>
            )}

        </div>
    );
};

export default Wall;


