import React from "react";
import "./routeCard.css";

const RouteCard = ({ name, grade, incline, description, notes}) => {
    return (
        <div className="route-card">
            <div> <strong>ROUTE: {name}</strong></div>
            <div><strong>DESCRIPTION:</strong></div>
            <div className="description">
                <div>{description}</div>
            </div>
            {notes && <div className="detail-item"><strong>OTHER NOTES:</strong> {notes}</div>}
            <div className="details">
                <div className="detail-item">
                    {/* <strong>WALL-INFORMATION:</strong> */}
                    <div className="detail-item">
                        <strong>GRADE:</strong> {grade}
                    </div>
                    <div className="detail-item">
                        <strong>INCLINE:</strong> {incline}°
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RouteCard;