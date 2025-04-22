import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { getDocs, updateDoc, getDoc, addDoc, deleteDoc, doc, collection, query, where, } from "firebase/firestore";
import "../components/routeProject.css"
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";


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
        console.log(`Searching for route: "${routeName}"`);
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
                return routeData;
            } else {
                console.log(`No route found with name: "${routeName}"`);
                setRoute(null);
            }
        } catch (error) {
            console.error("Error fetching route: ", error);
        }
    };

    const getRouteById = async (id) => {
        try {
            const docRef = doc(db, "routes", id);
            const routeDoc = await getDoc(docRef);
            if (routeDoc.exists()) {
                const routeData = { ...routeDoc.data(), id: routeDoc.id };
                setRoute(routeData);
            } else {
                console.log(`No route found with id: "${id}"`);
                setRoute(null);
            }
        } catch (error) {
            console.error("Error fetching route by ID: ", error);
            setRoute(null);
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
    const onSubmitRoute = async ({ name, grade, incline, description, notes, timestamp, image, comments, coordinates, wall, color, annotations, isAnnotate }) => {
        console.log("I AM CREATING A ROUTE")
        try {
            const routeCreator = onAuthStateChanged(auth, async (user) => {
                if (user) {
                    const owner = user.email
                    console.log("the owner of this route is: " + owner)
                    await addDoc(routeCollectionRef, {
                        name,
                        grade,
                        incline,
                        description,
                        notes,
                        timestamp,
                        image: image,
                        comments,
                        coordinates,
                        wall,
                        color,
                        owner,
                        annotations, // AC
                        isAnnotate
                    })
                    await getRouteList();
                } else {
                    alert("you must be logged in to create a route!")
                    console.error("you must be logged in to create a route!")
                    return;
                }
            });
        } catch (err) {
            console.error(err)
        }
    }

    /**
     * uses the current information the user has filled to update an existing route in the database
     */
    const onUpdateRoute = async ({ id, name, grade, incline, description, notes, timestamp, image, comments, coordinates, wall, color, annotations, isAnnotate }) => {
        try {
            const routeRef = doc(db, "routes", id);
            await updateDoc(routeRef, {
                name,
                grade,
                incline,
                description,
                notes,
                timestamp,
                image,
                comments,
                coordinates,
                wall,
                color,
                annotations, // AC
                isAnnotate
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
        navigate('/create', {
            state:
            {
                isEditing: true,
                id: id,
                routeData: routeDoc.data()
            }
        }); // Pass as an object
    }

    const getRoutesByWall = async (wallName) => {
        const q = query(routeCollectionRef, where("wall", "==", wallName));

        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const wallRoutes = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                return wallRoutes;
            } else {
                console.log(`No routes found for wall: "${wallName}"`);
                return [];
            }
        } catch (error) {
            console.error("Error fetching routes by wall:", error);
            return [];
        }
    };

    // loads in the list of routes in the database as soon as the component is rendered
    useEffect(() => {
        getRouteList();
    }, []);

    return { routesList, getRouteList, onDeleteRoute, onSubmitRoute, onEditRoute, onUpdateRoute, getRouteByName, getRouteById, getRoutesByWall, route };
};
