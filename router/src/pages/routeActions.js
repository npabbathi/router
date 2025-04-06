import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { getDocs, updateDoc, getDoc, addDoc, deleteDoc, doc, collection, query, where, } from "firebase/firestore";
import "../components/routeProject.css"
import { useNavigate } from 'react-router-dom';


// This file deals with displaying all of the routes in the firestore database, along with adding/deleting routes.
export const RouteActions = () => {

    //list of all the routes in firebase
    const [routesList, setRoutesList] = useState([]);
    const [route, setRoute] = useState(null);

    //get the collection of routes from firebase
    const routeCollectionRef = collection(db, "routes")

    //nagivation
    const navigate = useNavigate();

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

    /**
     * uses the current information the user has filled to update an existing route in the database
     */
    const onUpdateRoute = async ({ id, name, grade, incline, description, notes, timestamp, imagePath, comments }) => {
        try {
            const routeRef = doc(db, "routes", id);
            await updateDoc(routeRef, {
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

    /**
     * loads in the current route to be sent to /info to edit
     * 
     * @param {*} id id of the document to edit
     * @param {*} imageUrl image url (so we dont need to get from db again)
     */
    const onEditRoute = async (id, imageUrl) => {
        console.log("editing a route! id: " + id);
        const docRef = doc(db, "routes", id);
        const routeDoc = await getDoc(docRef);

        if (routeDoc.exists()) {
            console.log("Document data:", routeDoc.data());
        } else {
            console.error("No such document!");
            return;
        }
        
        //pass the document info to info
        navigate('/info', { state: 
            { 
                imageObject : imageUrl,
                imagePath : routeDoc.data().imagePath,
                isEditing : true,
                id: id,
                routeData: routeDoc.data()
            } 
        }); // Pass as an object
    }

    // loads in the list of routes in the database as soon as the component is rendered
    useEffect(() => {
        getRouteList();
    }, []);

    return { routesList, getRouteList, onDeleteRoute, onSubmitRoute, onEditRoute, onUpdateRoute, getRouteByName, route };
};
