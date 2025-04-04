import { useEffect, useState } from "react";
import "./routeCard.css"
import { storage } from "../config/firebase";

//this file deals with displaying a "card" or overview of a route, either used in the drafts or current/previous routes part of the website

export const RouteCard = ({name, grade, incline, description, onDeleteRoute, id, notes, timestamp, image, can_delete}) => {
    
    return (
        <div className="card">
            <h1>{name}</h1>
            <img src={image}></img>
            <hr/>
            <h2>{grade} - {incline}º</h2>
            <p>{description}</p>
            <p> {notes} </p>
            <p> {timestamp} </p>
            {can_delete && <button onClick={() => { onDeleteRoute(id) }}>Delete Route</button>}
        </div>
    )
}

export default RouteCard;