import { useEffect, useState } from "react";
import AllCard from "../components/allCard";
import "../components/routeProject.css"
import { RouteActions } from "./routeActions";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import RouterToast from "../components/toast";

// This file deals with displaying all of the routes in the firestore database to be used to go to the review page
export const All = () => {

    const { routesList } = RouteActions();
    const [routesWithUrls, setRoutesWithUrls] = useState([]);
    const [searchInput, setSearchInput] = useState("");
    const navigate = useNavigate();
    const { route, getRouteByName } = RouteActions();
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const fetchImageUrls = async () => {
            const updatedRoutes = await Promise.all(
                routesList.map(async (route) => {
                    if (route.image) {
                        try {
                            const imageRef = ref(storage, route.image);
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


    const handleSearchKeyPress = async (e) => {
        if (e.key === "Enter" && searchInput.trim() !== "") {
            try {
                const route = await getRouteByName(searchInput);
                console.log(route);
                navigate(`/review/${route.id}`);
            } catch (error) {
                console.error("Error finding route:", error);
                setToastMessage("Could not find route.");
                setToastType("danger");
                setShowToast(true);
            }
        }
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => setShowToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast]);

    return (
        <div>
            {showToast && (
                <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
                    <RouterToast message={toastMessage} type={toastType} />
                </div>
            )}
            <div className="allCards">
                <input className="all-search" type="text" placeholder="Search for a route by name" onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={handleSearchKeyPress}></input>
                {routesWithUrls.map((route) => (
                    <div key={route.id}>
                        <AllCard name={route.name} grade={route.grade} incline={route.incline} description={route.description} notes={route.notes} timestamp={route.timestamp} id={route.id} can_delete={false} image={route.imageUrl} annotations={route.annotations} isAnnotate={route.isAnnotate} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default All;