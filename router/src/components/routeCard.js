import "./routeCard.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

//this file deals with displaying a "card" or overview of a route, either used in the drafts or current/previous routes part of the website

export const RouteCard = ({ name, grade, incline, description, onDeleteRoute, onEditRoute, id, notes, timestamp, image, can_modify }) => {

    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="routeCard" onClick={() => { can_modify ? onEditRoute(id, image) : navigate(`/review/${id}`) }}>
            {/* for icon buttons (credit below) */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div className={`imagePreview ${isHovering ? "hover-cursor" : ""}`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                <div className="underImage">
                    <img src={image} alt={name}></img>
                </div>
                {isHovering &&
                    <div className="overTextDrafts">
                        <p> {description} </p>
                        <p3> {timestamp} </p3>
                    </div>
                }
            </div>
            <div className="titleInfo">
                <h1>{name}</h1>
                {can_modify && <button className="editButton" onClick={() => { onEditRoute(id, image) }}><i class="fa fa-pencil"></i></button>}
                <button className="trashButton" onClick={() => { onDeleteRoute(id) }}><i class="fa fa-trash"></i></button>
            </div>
            <h4>{grade} - {incline}º</h4>
        </div>
    )
}

export default RouteCard;