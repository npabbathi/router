import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { getDocs, addDoc, deleteDoc, doc, collection } from "firebase/firestore";
import RouteCard from "./routeCard";
import "./routeProject.css"
import { RouteActions } from "../pages/routeActions"; 
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

// This file deals with displaying all of the routes in the firestore database, along with adding/deleting routes.
export const RouteProject = () => {
    
    const { routesList, onSubmitRoute, onDeleteRoute } = RouteActions(); // hooks must be defined with uppercase
    const [routesWithUrls, setRoutesWithUrls] = useState([]);

    useEffect(() => {
        const fetchImageUrls = async () => {
            const updatedRoutes = await Promise.all(
                routesList.map(async (route) => {
                    if (route.imagePath) {
                        try {
                            const imageRef = ref(storage, route.imagePath);
                            const url = await getDownloadURL(imageRef);
                            return { ...route, imageUrl: url };
                        } catch (error) {
                            console.error("Failed to get image URL:", error);
                            return { ...route, imageUrl: null };
                        }
                    } else {
                        return { ...route, imageUrl: null };
                    }
                })
            );
            setRoutesWithUrls(updatedRoutes);
        };

        fetchImageUrls();
    
        }, [routesList, storage]);

    return (
        <div>
            <div className="allRouteCards">
                {routesWithUrls.map((route) => (
                    <div key={route.id}>
                        <h1>{route.image}</h1>
                        <RouteCard name={route.name} grade={route.grade} incline={route.incline} description={route.description} notes = {route.notes} timestamp = {route.timestamp} onDeleteRoute={onDeleteRoute} id={route.id} can_delete={true} image={route.imageUrl}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RouteProject;