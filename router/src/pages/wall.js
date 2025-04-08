import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Stage, Layer, Circle, Image as KonvaImage } from "react-konva";
import useImage from "use-image";
import "./wall.css";

const Wall = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const imageUrl = params.get("image");

    const [image] = useImage(imageUrl);
    const [circles, setCircles] = useState([]);
    const containerRef = useRef(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

    // Padding initializations for top and bottom
    const paddingTop = 20; // padding value for top
    const paddingBottom = 20; // padding value for bottom

    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setContainerSize({ width: rect.width, height: rect.height });
        }
    }, [imageUrl]);

    const scale = image
        ? Math.min(containerSize.width / image.width, (containerSize.height - paddingTop - paddingBottom) / image.height) // Adjust scale considering padding
        : 1;

    const placeCircle = (e) => {
        // Ensures the action of placing a circle responds to only left clicks
        if (e.evt.button !== 0) return;

        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();
    
        // Adjust for image offset, scale, and padding
        const imageX = (containerSize.width - image.width * scale) / 2;
        const imageY = (containerSize.height - image.height * scale - paddingTop - paddingBottom) / 2 + paddingTop; // Account for padding

        const x = (pointer.x - imageX) / scale;
        const y = (pointer.y - imageY) / scale;

        console.log(`Circle placed at: x=${x.toFixed(2)}, y=${y.toFixed(2)}`);
    
        setCircles((prev) => [
            ...prev,
            { x, y }, // image-space coords
        ]);
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

                            {/* Dynamically-size circles */}
                            {circles.map((circle, idx) => (
                                <Circle
                                    key={idx}
                                    x={circle.x * scale + (containerSize.width - image.width * scale) / 2}
                                    y={circle.y * scale + (containerSize.height - image.height * scale - paddingTop - paddingBottom) / 2 + paddingTop}
                                    radius={10}
                                    fill="rgba(255, 0, 0, 0.5)"
                                    stroke="red"
                                    strokeWidth={2}
                                />
                            ))}
                        </Layer>
                    </Stage>
                )}
            </div>
        </div>
    );
};


export default Wall;
