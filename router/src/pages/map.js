import gym_map from '../images/map1.png'; //default map image for now.

import React from 'react';
import './map.css';
import ImageMapper from "react-img-mapper";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// interactive areas/walls of the map
const areas = [
    {
        name: "FS1",
        shape: "poly",
        coords: [194, 351, 228, 323, 246, 334, 242, 344, 247, 355, 236, 390, 225, 402, 203, 386],
        fillColor: "rgba(255, 0, 0, 0.70)",
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/fs1.png`
    },
    {
        name: "East Wall",
        shape: "poly",
        coords: [77, 33, 209, 34, 186, 98, 215, 161, 150, 310, 126, 500, 112, 571, 77, 574],
        fillColor: "rgba(255, 0, 0, 0.70)",
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/east-wall.png`
    },
    {
        name: "FS2",
        shape: "poly",
        coords: [285, 154, 313, 176, 351, 245, 343, 263, 327, 277, 289, 270, 286, 248, 272, 222],
        fillColor: "rgba(255, 0, 0, 0.70)",
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/fs2.png`
    },
    {
        name: "North Wall",
        shape: "poly",
        coords: [541, 549, 571, 565, 164, 566, 234, 500, 420, 559, 433, 547, 443, 531],
        fillColor: "rgba(255, 0, 0, 0.70)",
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/north-wall.png`
    },
    {
        name: "Roof",
        shape: "poly",
        coords: [327, 34, 577, 34, 514, 82, 467, 175, 413, 152, 371, 118, 354, 99, 336, 65],
        fillColor: "rgba(255, 0, 0, 0.70)",
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/roof.png`
    },
    {
        name: "FS3",
        shape: "poly",
        coords: [611, 117, 650, 92, 713, 154, 698, 193, 681, 219, 647, 217, 629, 221],
        fillColor: "rgba(255, 0, 0, 0.70)",
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/fs3.png`
    },
    {
        name: "FS4",
        shape: "poly",
        coords: [677, 356, 685, 346, 707, 335, 711, 359, 718, 376, 718, 389, 699, 428, 672, 426, 675, 396, 671, 376],
        fillColor: "rgba(255, 0, 0, 0.70)",
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/fs4.png`
    },
    {
        name: "West Wall",
        shape: "poly",
        coords: [732, 33, 882, 33, 882, 536, 767, 536, 767, 566, 739, 566, 737, 555, 741, 545, 767, 525, 835, 514, 781, 273, 794, 74],
        fillColor: "rgba(255, 0, 0, 0.70)",
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/west-wall.png`
    },
    {
        name: "FSBIG",
        shape: "poly",
        coords: [458, 297, 466, 249, 508, 222, 554, 233, 591, 297, 589, 353, 569, 434, 388, 450, 370, 457, 354, 453,
            344, 436, 331, 428, 321, 401, 327, 389, 325, 371, 376, 379, 400, 374, 449, 322, 473, 317, 446, 334, 396, 381,
            366, 385, 332, 379, 328, 394, 330, 415, 344, 436, 363, 451, 397, 447, 463, 417, 550, 333, 557, 292, 509, 227, 471, 249, 458, 297],
        fillColor: "rgba(255, 0, 0, 0.70)",
        strokeColor: "black",
        link: "/wall",
        image: `${process.env.PUBLIC_URL}/images/map1-walls/fsbig.png`
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
    const location = useLocation();
    const navigate = useNavigate();
    const [mapWidth, setMapWidth] = useState(Math.max(window.innerWidth * 0.55, MIN_WIDTH));
    const [isHovering, setIsHovering] = useState(false);

    const isFromDrafts = location.state?.isFromDrafts;
    const routeData = location.state?.routeData;
    const isPlacingRoute = location.state?.isPlacingRoute;
    const routeName = location.state?.routeName;
    const grade = location.state?.grade;
    const incline = location.state?.incline;
    const description = location.state?.description;
    const notes = location.state?.notes;
    const timestamp = location.state?.timestamp;
    const image = location.state?.image;
    const comments = location.state?.comments;
    const coordinates = location.state?.coordinates;
    const wall = location.state?.wall;
    const color = location.state?.color;
    const id = location.state?.id;

    const annotations = location.state?.annotations;  // AC: TESTING
    const isAnnotate = location.state?.isAnnotate;


    // the methods below are related to the interactivity and resizing of the map
    const handleResize = () => {
        setMapWidth(Math.max(window.innerWidth * 0.55, MIN_WIDTH));
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleAreaClick = (area) => {
        if (area.link) {
            navigate(`${area.link}?image=${encodeURIComponent(area.image)}`, {
                state: {
                    isFromDrafts,
                    routeData,
                    isPlacingRoute: isPlacingRoute,
                    routeName,
                    grade,
                    incline,
                    description,
                    notes,
                    timestamp,
                    image,
                    comments: [],
                    coordinates,
                    wall,
                    color,
                    id,
                    annotations, // AC
                    isAnnotate,
                }
            });
        }
    };

    const toCreatePage = () => {
        navigate(`/create`);
    }

    return (
        <div>
            <div className="header">
                <h1><b>SELECT A WALL</b></h1>
                {!isPlacingRoute && (
                    <button className="button-and-label" type='button' onClick={toCreatePage} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}><b>+</b></button>
                )}
            </div>
            <p className={`${isHovering ? "hover-cursor" : "unhover-cursor"} tip`}>CREATE A NEW ROUTE</p>
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
