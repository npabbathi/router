import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';


const Annotate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const isFromDrafts = location.state?.isFromDrafts;
    const routeData = location.state?.routeData;
    const routeName = location.state?.routeName;
    const grade = location.state?.grade;
    const incline = location.state?.incline;
    const description = location.state?.description; 
    const notes = location.state?.notes; 
    const timestamp = location.state?.timestamp; 
    const imagePath = location.state?.imagePath; 
    const comments = location.state?.comments;
    const coordinates = location.state?.coordinates;
    const wall = location.state?.wall;
    const color = location.state?.color;
    
    // useless prevPage. Needs to send back info probably???
    const prevPage = () => {
        navigate('/create');
    }

    const nextPage = () =>{
        navigate('/map', {state:
            {
                isFromDrafts,
                routeData,
                isPlacingRoute: true,
                routeName,
                grade,
                incline,
                description, 
                notes, 
                timestamp, 
                imagePath, 
                comments:[],
                coordinates,
                wall,
                color
            }
        });
    }



    return (
        <div>
            <h1>Annotate page</h1>
            
            <div className = 'button-row'>
                <div className = 'button-left'>
                    <button type = 'button' className = 'navigate-button' onClick={prevPage} > Back </button>
                </div>
                <div className = 'button-right'>
                    <button type = 'button' className = 'navigate-button' onClick={nextPage} > Next </button>
                </div>
            </div>

        </div>
    );
};

export default Annotate;
