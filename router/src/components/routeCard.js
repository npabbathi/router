import { useEffect, useState } from "react";
import "./routeCard.css"

//this file deals with displaying a "card" or overview of a route, either used in the drafts or current/previous routes part of the website

export const RouteCard = ({name, grade, incline, description, onDeleteRoute, id, notes, timestamp}) => {
    
    return (
        <div className="card">
            <h1>{name}</h1>
            <hr/>
            <h2>{grade} - {incline}º</h2>
            {/* <h2>V{grade} - {incline}º</h2> */} 
            <p>{description}</p>
            <p> {notes} </p>
            <p> {timestamp} </p>
            <button onClick={() => {onDeleteRoute(id)}}>Delete Route</button>
        </div>
    )
}

export default RouteCard;