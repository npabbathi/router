import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Circle, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import "./wall.css";
import { RouteActions } from "./routeActions";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";


const Wall = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const imageUrl = params.get("image");
    const [image] = useImage(imageUrl);

    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const { getRoutesByWall } = RouteActions();
    const [wallName, setWallName] = useState("");
    const [wallRoutes, setWallRoutes] = useState([]);

    const [circles, setCircles] = useState([]); // *NEEDS TO BE USED FOR LATER, WHEN A USER is placing a route*
    const routeData = location.state?.routeData;
    const isPlacingRoute = location.state?.isPlacingRoute;


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

    // Plot circles for each route based on its coordinates
    const plotRouteCircles = () => {
        const routeCircles = wallRoutes.map((route, idx) => {
            const { x, y } = route.coordinates || {};
            if (x && y) {
                // Convert to image space (taking scale and offset into account)
                const imageX = (containerSize.width - image.width * scale) / 2;
                const imageY = (containerSize.height - image.height * scale - paddingTop - paddingBottom) / 2 + paddingTop;
                
                const circleX = x * scale + imageX;
                const circleY = y * scale + imageY;

                return (
                    <Circle
                        key={idx}
                        x={circleX}
                        y={circleY}
                        radius={11}
                        fill={route.color}
                        stroke={route.color}
                        strokeWidth={2}
                    />
                );
            }
            return null;
        });

        return routeCircles;
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

    const placeCircle = async (e) => {
        //checks if isPlacingRoute is true
        if (!isPlacingRoute || !image) return;

        // user can't place a route with right-click. ONLY left-click permitted
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

        // update the route's x and y coordinates, and wall name. **** UGHHH THIS DOESN'T WORK WHY!!!!!!! USE Nidhi's updateRoute() method?
        if (routeData?.id) {
            const routeRef = doc(db, "routes", routeData.id);
            try {
                await updateDoc(routeRef, {
                    coordinates: { x, y },
                    wall: wallName,
                });
                console.log("Coordinates updated successfully.");
            } catch (err) {
                console.error("Failed to update coordinates:", err);
            }
        }
        
    };
    

    return (
        <div>
            <h1 className="header">Select a Route</h1>
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
                                    <Circle
                                        key={`new-${idx}`}
                                        x={circle.x * scale + imageX}
                                        y={circle.y * scale + imageY}
                                        radius={11}
                                        fill="rgba(0, 128, 255, 0.8)" // different color for now
                                        stroke="blue"
                                        strokeWidth={2}
                                    />
                                );
                            })}


                        </Layer>
                    </Stage>
                )}
            </div>
        </div>
    );
};

export default Wall;


