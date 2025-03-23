import gym_map from '../images/map1.png';
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
        link: "/wall"
     }


    // { name: "Wall2", shape: "circle", coords: [194, 3, 5], preFillColor: "red" }
];

const ClimbingMap = () => {
    const navigate = useNavigate();

    const handleAreaClick = (area) => {
        if (area.link) {
            navigate(area.link); // Navigate to the page
        }
    };

    return (
        <div>
            <h1 className="header">Select a Wall</h1>
            <div className="map-con">
                <ImageMapper
                    src={gym_map}
                    name="climbing-map"
                    areas={areas}
                    onClick={(area) => handleAreaClick(area)}
                />
            </div>
        </div>
    )
}

export default ClimbingMap;
