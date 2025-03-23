import gym_map from '../images/map1.png';
import React from 'react';
import './map.css';
import ImageMapper from "react-img-mapper";


const ClimbingMap = () => {
    return (
        <div>
            <h1 className="header">Select a Wall</h1>
            <div className="map-con">
                <img
                    alt = ""
                    className = "map-img"
                    src={gym_map}
                />
            </div>

        </div>
    );
};

export default ClimbingMap;
