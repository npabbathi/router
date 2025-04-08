import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Circle, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import "./wall.css";
import { RouteActions } from "./routeActions";

const Wall = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const imageUrl = params.get("image");
    const [image] = useImage(imageUrl);

    const [circles, setCircles] = useState([]); // *NEEDS TO BE USED FOR LATER, WHEN A USER is placing a route*
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    const { getRoutesByWall } = RouteActions();
    const [wallName, setWallName] = useState("");
    const [wallRoutes, setWallRoutes] = useState([]);

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
                        radius={10}
                        fill="rgba(255, 0, 0, 0.5)"
                        stroke="red"
                        strokeWidth={2}
                    />
                );
            }
            return null;
        });

        return routeCircles;
    };

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

    return (
        <div>
            <h1 className="header">Select a Route</h1>
            <div className="wall-con" ref={containerRef}>
                {image && (
                    <Stage
                        width={containerSize.width}
                        height={containerSize.height}
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
                        </Layer>
                    </Stage>
                )}
            </div>
        </div>
    );
};

export default Wall;

//---- THE CODE BELOW IS A ROUGH LOGIC OF HOW TO PLACE A CIRCLE ON THE MAP. Will be revisited soon for when users place a route on a map.* ---//


// import React, { useState, useRef, useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import { Stage, Layer, Circle, Image as KonvaImage } from "react-konva";
// import useImage from "use-image";
// import "./wall.css";
// import { RouteActions } from "./routeActions"


// const Wall = () => {
//     const location = useLocation();
//     const params = new URLSearchParams(location.search);
//     const imageUrl = params.get("image");
//     const [image] = useImage(imageUrl);

//     const [circles, setCircles] = useState([]);
//     const containerRef = useRef(null);
//     const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

//     const {getRoutesByWall} = RouteActions();
//     const [wallName, setWallName] = useState("");
//     const [wallRoutes, setWallRoutes] = useState([]);

//     // extracts only the name of the wall. For example: "east-wall" or "fs1"
//     useEffect(() => {
//         if (imageUrl) {
//             const parts = imageUrl.split('/');
//             const fileName = parts[parts.length - 1];
//             const nameWithoutExtension = fileName.split('.')[0];
//             setWallName(nameWithoutExtension);
//         }
//     }, [imageUrl]);

//     // fetches all routes that belong to this wall
//     useEffect(() => {
//         const fetchRoutes = async () => {
//             if (wallName) {
//                 const routes = await getRoutesByWall(wallName);
//                 setWallRoutes(routes);
//             }
//         };
    
//         fetchRoutes();
//     }, [wallName]);

    
//     // Padding initializations for top and bottom 
//     const paddingTop = 20; // padding value for top
//     const paddingBottom = 20; // padding value for bottom


//     useEffect(() => {
//         if (containerRef.current) {
//             const rect = containerRef.current.getBoundingClientRect();
//             setContainerSize({ width: rect.width, height: rect.height });
//         }
//     }, [imageUrl]);

//     const scale = image
//         ? Math.min(containerSize.width / image.width, (containerSize.height - paddingTop - paddingBottom) / image.height) // Adjust scale according to padding
//         : 1;

//     const placeCircle = (e) => {
//         // Ensures the action of placing a circle responds to only left clicks
//         if (e.evt.button !== 0) return;

//         const stage = e.target.getStage();
//         const pointer = stage.getPointerPosition();
    
//         // Adjust for image offset, scale, and padding
//         const imageX = (containerSize.width - image.width * scale) / 2;
//         const imageY = (containerSize.height - image.height * scale - paddingTop - paddingBottom) / 2 + paddingTop; // Account for padding

//         const x = (pointer.x - imageX) / scale;
//         const y = (pointer.y - imageY) / scale;

//         console.log(`Circle placed at: x=${x.toFixed(2)}, y=${y.toFixed(2)}`);
    
//         setCircles((prev) => [
//             ...prev,
//             { x, y }, // image-space coordinates
//         ]);
//     };

//     useEffect(() => {
//         const handleResize = () => {
//             if (containerRef.current) {
//                 const rect = containerRef.current.getBoundingClientRect();
//                 setContainerSize({ width: rect.width, height: rect.height });
//             }
//         };
    
//         window.addEventListener("resize", handleResize);
//         handleResize();
    
//         return () => window.removeEventListener("resize", handleResize);
//     }, [imageUrl]);

//     return (
//         <div>
//             <h1 className="header">Select a Route</h1>
//             <div className="wall-con" ref={containerRef}>
//                 {image && (
//                     <Stage
//                         width={containerSize.width}
//                         height={containerSize.height}
//                         onClick={placeCircle}
//                     >
//                         <Layer>
//                             {/* Scaled image with padding */}
//                             <KonvaImage
//                                 image={image}
//                                 x={(containerSize.width - image.width * scale) / 2}
//                                 y={(containerSize.height - image.height * scale - paddingTop - paddingBottom) / 2 + paddingTop}
//                                 scaleX={scale}
//                                 scaleY={scale}
//                             />

//                             {/* Dynamically-size circles */}
//                             {circles.map((circle, idx) => (
//                                 <Circle
//                                     key={idx}
//                                     x={circle.x * scale + (containerSize.width - image.width * scale) / 2}
//                                     y={circle.y * scale + (containerSize.height - image.height * scale - paddingTop - paddingBottom) / 2 + paddingTop}
//                                     radius={10}
//                                     fill="rgba(255, 0, 0, 0.5)"
//                                     stroke="red"
//                                     strokeWidth={2}
//                                 />
//                             ))}
//                         </Layer>
//                     </Stage>
//                 )}
//             </div>
//         </div>
//     );
// };


// export default Wall;

