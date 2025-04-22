import React from "react";
import "./reviewCard.css";
import InclineVisual from './incline';

const ReviewCard = ({ name, grade, incline, description, notes }) => {
    return (
        <div className="container">
            <div className="review-card">
                <div className="row">
                    <div className="route-title"> <strong>ROUTE: {name}</strong></div>
                    <div className="route-subtitle"><strong>DESCRIPTION:</strong></div>
                    <div className="description">
                        <div>{description}</div>
                    </div>
                    {notes && (
                        <>
                            <div className="route-subtitle">
                                <strong>OTHER NOTES:</strong>
                            </div>
                            <div className="description">
                                <div>{description}</div>
                            </div>
                        </>
                    )}
                </div>
                <div className="row">
                    <div className="col-6">
                        <div className="route-subtitle">
                            <strong>GRADE:</strong>
                            <div className="route-grades">
                                <button className="route-grade selected">{grade}</button>
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="route-subtitle">
                            <strong>INCLINE:</strong> {incline}°
                            <div className="incline-section">
                                <InclineVisual angle={incline} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewCard;