import { useEffect, useState } from "react";
import AllCard from "../components/allCard";
import "../components/routeProject.css"
import { RouteActions } from "./routeActions"; 
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

// This file deals with displaying all of the routes in the firestore database to be used to go to the review page
export const All = () => {
    
    const { routesList } = RouteActions();
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
                        <AllCard name={route.name} grade={route.grade} incline={route.incline} description={route.description} notes = {route.notes} timestamp = {route.timestamp} id={route.id} can_delete={false} image={route.imageUrl}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default All;