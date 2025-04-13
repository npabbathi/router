import "./allCard.css"
import 'bootstrap/dist/css/bootstrap.min.css';
// import { IdCard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

//this file deals with displaying a "card" or overview of a route, either used in the drafts or current/previous routes part of the website

export const AllCard = ({ name, grade, incline, description, id, notes, timestamp, image }) => {

    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="allCard">
            {/* for icon buttons (credit below) */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div className="allImagePreview" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                <div className="underImage">
                    <img src={image}></img>
                </div>
                {isHovering &&
                    <div className="overText" onClick={() => navigate(`/review/${id}`)}>
                        <p3> {timestamp} </p3>
                        <p> Description: {description}</p>
                        <p> Notes: {notes} </p>
                    </div>
                }
            </div>
            <div className="titleInfo">
                <h1>{name}</h1>
                <button onClick={() => navigate(`/review/${id}`)}>
                    <i className="fa fa-eye"></i>
                </button>
            </div>
            <h4>{grade} - {incline}º</h4>
        </div>
    )
}

export default AllCard;