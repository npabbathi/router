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
    const [selectedGrade, setSelectedGrade] = useState("All");
    const [sortNewest, setSortNewest] = useState(false);

    useEffect(() => {
        const fetchImageUrls = async () => {
            const updatedRoutes = await Promise.all(
                routesList.map(async (route) => {
                    let timestampMillis = 0;
                    if (typeof route.timestamp === "string") {
                        timestampMillis = new Date(route.timestamp).getTime();
                    }

                    if (route.image) {
                        try {
                            const imageRef = ref(storage, route.image);
                            const url = await getDownloadURL(imageRef);
                            return { ...route, imageUrl: url, timestamp: timestampMillis };
                        } catch (error) {
                            console.error("Failed to get image URL:", error);
                            return { ...route, imageUrl: null, timestamp: timestampMillis };
                        }
                    } else {
                        return { ...route, imageUrl: null, timestamp: timestampMillis };
                    }
                })
            );
            setRoutesWithUrls(updatedRoutes);
        };

        fetchImageUrls();

    }, [routesList, storage]);

    const filteredRoutes = routesWithUrls
        .filter((route) => selectedGrade === "All" || route.grade === selectedGrade)
        .sort((a, b) => sortNewest ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);

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
                <div className="row">
                    <input className="all-search" type="text" placeholder="Search for a route by name" onChange={(e) => setSearchInput(e.target.value)}
                        onKeyDown={handleSearchKeyPress}></input>
                </div>
                <div className="row">
                    <div className="filters">
                        <select className="filter" value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value)}>
                            <option value="All">All Grades</option>
                            <option value="V1">V1</option>
                            <option value="V2">V2</option>
                            <option value="V3">V3</option>
                            <option value="V4">V4</option>
                            <option value="V5">V5</option>
                            <option value="V6">V6</option>
                            <option value="V7">V7</option>
                            <option value="V8">V8</option>
                            <option value="V9">V9</option>
                        </select>
                        <button onClick={() => setSortNewest(!sortNewest)}>
                            {sortNewest ? "Sort: Newest First" : "Sort: Oldest First"}
                        </button>
                    </div>
                </div>
                {filteredRoutes.map((route) => (
                    <div key={route.id}>
                        <AllCard
                            name={route.name}
                            grade={route.grade}
                            incline={route.incline}
                            description={route.description}
                            notes={route.notes}
                            timestamp={route.timestamp}
                            id={route.id}
                            can_delete={false}
                            image={route.imageUrl}
                            annotations={route.annotations}
                            isAnnotate={route.isAnnotate}
                        />
                    </div>
                ))}

            </div>
        </div>
    )
}

export default All;