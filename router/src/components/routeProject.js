import { useEffect, useState } from "react";
import RouteCard from "./routeCard";
import "./routeProject.css"
import { RouteActions } from "../pages/routeActions"; 
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

// This file deals with displaying all of the routes in the firestore database, along with adding/deleting routes.
export const RouteProject = () => {
    
    const { routesList, onEditRoute, onDeleteRoute } = RouteActions();
    const [currentUser, setCurrentUser] = useState(null);
    const [toggleDraftsOrAll, setToggleDraftsOrAll] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user ? user.email : null);
        });
    
        }, [routesList, storage]);

    return (
        <div>
            <button disabled={!toggleDraftsOrAll} onClick={() => {setToggleDraftsOrAll(!toggleDraftsOrAll)}}> Show Drafts </button>
            <button disabled={toggleDraftsOrAll} onClick={() => {setToggleDraftsOrAll(!toggleDraftsOrAll)}}> Show All Routes </button>
            <div className="allRouteCards">
                {routesList.map((route) => (
                    <div key={route.id}>
                        {(currentUser === route.owner && toggleDraftsOrAll) && <RouteCard name={route.name} grade={route.grade} incline={route.incline} description={route.description} notes = {route.notes} timestamp = {route.timestamp} onDeleteRoute={onDeleteRoute} onEditRoute={onEditRoute} id={route.id} can_modify={true} image={route.image}/>}
                        {(currentUser === route.owner && !toggleDraftsOrAll && route.wall === "") && <RouteCard name={route.name} grade={route.grade} incline={route.incline} description={route.description} notes = {route.notes} timestamp = {route.timestamp} onDeleteRoute={onDeleteRoute} onEditRoute={onEditRoute} id={route.id} can_modify={true} image={route.image}/>}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RouteProject;