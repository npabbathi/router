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
        image: `${process.env.PUBLIC_URL}/images/map1-walls/fs1.png`
     },
    { name: "East Wall", 
        shape: "poly", 
        coords: [77, 33, 209, 34, 186, 98, 215, 161, 150, 310, 126, 500, 112, 571, 77, 574],
        fillColor: "rgba(255, 0, 0, 0.70)", 
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/east-wall.png`
     },
    { name: "FS2", 
        shape: "poly", 
        coords: [285, 154, 313, 176, 351, 245, 343, 263, 327, 277, 289, 270, 286, 248, 272, 222],
        fillColor: "rgba(255, 0, 0, 0.70)", 
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/fs2.png`
     },
     { name: "North Wall", 
        shape: "poly", 
        coords: [541, 549, 571, 565, 164, 566, 234, 500, 420, 559, 433, 547, 443, 531],
        fillColor: "rgba(255, 0, 0, 0.70)", 
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/north-wall.png`
     },
    // { name: "test", 
    //     shape: "circle", 
    //     coords: [0, 0, 5],
    //     preFillColor: "yellow", 
    //     fillColor: "rgba(255, 0, 0, 0.70)", 
    //     strokeColor: "black",
    //     link: "/wall",
    //     image: ""
    //  }
];

const MIN_WIDTH = 500;

const ClimbingMap = () => {
    const navigate = useNavigate();
    const [mapWidth, setMapWidth] = useState(Math.max(window.innerWidth * 0.55, MIN_WIDTH));

    const handleResize = () => {
        setMapWidth(Math.max(window.innerWidth * 0.55, MIN_WIDTH));
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
            <div className="header">note: east wall, fs1, and fs2 can be selected</div>   {/** delete later once everything is fleshed */}
            <div className="map-con">
                <ImageMapper
                    src={gym_map}
                    name="climbing-map"
                    areas={areas}
                    onClick={(area) => handleAreaClick(area)}
                    responsive
                    parentWidth={mapWidth}
                />
            </div>
        </div>
    )
}

export default ClimbingMap;
