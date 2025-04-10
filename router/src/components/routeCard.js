import "./routeCard.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

//this file deals with displaying a "card" or overview of a route, either used in the drafts or current/previous routes part of the website

export const RouteCard = ({name, grade, incline, description, onDeleteRoute, onEditRoute, id, notes, timestamp, image, can_modify}) => {

    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();
    
    return (
        <div className="routeCard">
            {/* for icon buttons (credit below) */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div className="imagePreview" onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                <div className="underImage">
                    <img src={image} alt={name}></img>
                </div>
                { isHovering &&
                    <div className="overText" onClick={() => {can_modify ? onEditRoute(id, image) : navigate(`/review/${id}`)}}>
                        <p3> {timestamp} </p3>
                        <p> Description: {description}</p>
                        <p> Notes: {notes} </p>
                    </div>
                }
            </div>
            <div className="titleInfo">
                <h1>{name}</h1>
                {can_modify && <button onClick={() => { onEditRoute(id, image) }}><i class="fa fa-pencil"></i></button>}
                {can_modify && <button onClick={() => { onDeleteRoute(id) }}><i class="fa fa-trash"></i></button>}
            </div>
            <h4>{grade} - {incline}º</h4>
        </div>
    )
}

export default RouteCard;