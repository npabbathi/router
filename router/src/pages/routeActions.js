import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { getDocs, addDoc, deleteDoc, doc, collection, query, where, } from "firebase/firestore";
import "../components/routeProject.css"


// This file deals with displaying all of the routes in the firestore database, along with adding/deleting routes.
export const RouteActions = () => {

    //list of all the routes in firebase
    const [routesList, setRoutesList] = useState([]);
    const [route, setRoute] = useState(null);

    //get the collection of routes from firebase
    const routeCollectionRef = collection(db, "routes")

    const getRouteList = async () => {
        try {
            const data = await getDocs(routeCollectionRef);
            const filteredData = data.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setRoutesList(filteredData);
        } catch (err) {
            console.error(err);
        }
    };

    const getRouteByName = async (routeName) => {
        console.log(`Searching for route: ${routeName}`); // Log the search term
        const routeCollectionRef = collection(db, "routes");
        const q = query(routeCollectionRef, where("name", "==", routeName));

        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const filteredData = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                const routeData = filteredData[0];
                setRoute(routeData);
            } else {
                console.log(`No route found with name: "${routeName}"`); // Log no results
                setRoute(null);
            }
        } catch (error) {
            console.error("Error fetching route: ", error);
        }
    };
    /**
     * uses firestore to delete a route in the database
     */
    const onDeleteRoute = async (id) => {
        const routeDoc = doc(db, "routes", id);
        await deleteDoc(routeDoc);
        await getRouteList();
    }

    /**
     * uses the current information the user has filled to create a new route to store in the database
     */
    const onSubmitRoute = async ({ name, grade, incline, description, notes, timestamp, imagePath, comments }) => {
        // e.preventDefault(); //to prevent page refresh
        try {
            await addDoc(routeCollectionRef, {
                name,
                grade,
                incline,
                description,
                notes,
                timestamp,
                imagePath,
                comments
            })
            await getRouteList();
        } catch (err) {
            console.error(err)
        }
    }

    // loads in the list of routes in the database as soon as the component is rendered
    useEffect(() => {
        getRouteList();
    }, []);

    return { routesList, getRouteList, onDeleteRoute, onSubmitRoute, getRouteByName, route };
};
