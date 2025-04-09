import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';


const Annotate = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const routeData = location.state?.routeData;
    
    // useless prevPage. Needs to send back info
    const prevPage = () => {
        navigate('/info');
    }

    const nextPage = () =>{
        navigate('/map', {state:
            {
                isPlacingRoute: true,
                routeData: routeData
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
