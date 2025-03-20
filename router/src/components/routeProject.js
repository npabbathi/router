import { db } from "../config/firebase";
import { useEffect, useState } from "react";
import { getDocs, addDoc, deleteDoc, doc, collection } from "firebase/firestore";

export const RouteProject = () => {
    
    //list of all the routes in firebase
    const [routesList, setRoutesList] = useState([]);

    //get the collection of movies from firebase
    const routeCollectionRef = collection(db, "routes")

    //adding a new route
    const [name, setName] = useState("My New Route");
    const [grade, setGrade] = useState(0);
    const [incline, setIncline] = useState(90);
    const [description, setDescription] = useState("Climbing climbing, boulder boulder, rock rock.");

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

    const onDeleteRoute = async (id) => {
        const routeDoc = doc(db, "routes", id);
        await deleteDoc(routeDoc);
        await getRouteList();
    }

    const onSubmitRoute = async () => {
        try {
            await addDoc(routeCollectionRef, {
                name: name,
                grade: grade,
                incline: incline,
                description: description,
            })
            await getRouteList();
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        getRouteList();
    }, []);

    return (
        <div>
            <h1>New Route:</h1>
            <input placeholder="Name" onChange={(e) => setName(e.target.value)}></input>
            <input placeholder="Grade" type="number" onChange={(e) => setGrade(e.target.value)}></input>
            <input placeholder="Incline/Angle" type="range" min="0" max="180" step="5" onChange={(e) => setIncline(e.target.value)}/><label>{incline}</label>
            <input placeholder="Description" onChange={(e) => setDescription(e.target.value)}></input>
            <button onClick={onSubmitRoute}> Add new route </button>

            <h1>{name}</h1>
            <h2>V{grade} - {incline}º</h2>
            <p>{description}</p>
            <hr/>
            {routesList.map((route) => (
                <div>
                    <h1>{route.name}</h1>
                    <h2>V{route.grade} - {route.incline}º</h2>
                    <p>{route.description}</p>
                    <button onClick={() => {onDeleteRoute(route.id)}}>-</button>
                </div>
            ))}
        </div>
    )
}

export default RouteProject;