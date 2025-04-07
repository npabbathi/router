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

    useEffect(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setContainerSize({ width: rect.width, height: rect.height });
        }
    }, [imageUrl]);

    const scale = image
        ? Math.min(containerSize.width / image.width, containerSize.height / image.height)
        : 1;

    const placeCircle = (e) => {
        const stage = e.target.getStage();
        const pointer = stage.getPointerPosition();

        // Convert pointer to image-space coordinates
        const x = pointer.x / scale;
        const y = pointer.y / scale;

        setCircles((prev) => [
            ...prev,
            {
                x: pointer.x, // keep in screen-space for rendering
                y: pointer.y,
            },
        ]);
    };

    return (
        <div>
            <h1 className="header">Select a Route</h1>
            <div className="wall-con" ref={containerRef}>
                {image && (
                    <Stage
                        width={image.width * scale}
                        height={image.height * scale}
                        onClick={placeCircle}
                    >
                        <Layer>
                            {/* Scaled image */}
                            <KonvaImage
                                image={image}
                                x={0}
                                y={0}
                                scaleX={scale}
                                scaleY={scale}
                            />

                            {/* Fixed-size circles */}
                            {circles.map((circle, idx) => (
                                <Circle
                                    key={idx}
                                    x={circle.x}
                                    y={circle.y}
                                    radius={9} // 15 pixel-sized circles, regardless of image scale
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
