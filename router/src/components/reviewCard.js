import React from "react";
import "./reviewCard.css";

const ReviewCard = ({ name, grade, incline, description, notes }) => {
    return (
        <div className="container">
            <div className="review-card">
                <div className="row">
                    <div> <strong>ROUTE: {name}</strong></div>
                    <div><strong>DESCRIPTION:</strong></div>
                    <div className="description">
                        <div>{description}</div>
                    </div>
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
        </div>
    );
};

export default ReviewCard;