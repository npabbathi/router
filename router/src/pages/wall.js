import React from 'react';
import './map.css';
import { useLocation } from 'react-router-dom';

const Wall = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const imageUrl = params.get("image");

    return (
        <div>
            <h1 className="header">Select a Route</h1>

            <div className="map-con">
                {imageUrl && <img src={imageUrl} alt="Selected Wall" className="map-img" />}
            </div>

        </div>
    );
};

export default Wall;
