import gym_map from '../images/map1.png'; //default map image for now.

import React from 'react';
import './map.css';
import ImageMapper from "react-img-mapper";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


const areas = [
    { name: "FS1", 
        shape: "poly", 
        coords: [194, 351, 228, 323, 246, 334, 242, 344, 247, 355, 236, 390, 225, 402, 203, 386], 
        fillColor: "rgba(255, 0, 0, 0.70)", 
        strokeColor: "black",
        link: "/wall",
        image: "/images/map1-walls/fs1.png"
     }
];

const ClimbingMap = () => {
    const navigate = useNavigate();
    const [mapWidth, setMapWidth] = useState(window.innerWidth * 0.8)

    const handleResize = () => {
        setMapWidth(window.innerWidth * 0.8); // Update width on resize
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleAreaClick = (area) => {
        if (area.link) {
            navigate(`${area.link}?image=${encodeURIComponent(area.image)}`);
        }
    };

    return (
        <div>
            <h1 className="header">Select a Wall</h1>
            <div className="header">note: select FS1 for now</div>   {/** delete later once everything is fleshed */}
            <div className="map-con">
                <ImageMapper
                    src={gym_map}
                    name="climbing-map"
                    areas={areas}
                    onClick={(area) => handleAreaClick(area)}
                    // imgWidth={930}
                    responsive
                    parentWidth={mapWidth}
                    natural
                />
            </div>
        </div>
    )
}

export default ClimbingMap;
