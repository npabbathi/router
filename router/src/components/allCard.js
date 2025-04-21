import "./reviewCard.css"
import "./allCard.css"
import 'bootstrap/dist/css/bootstrap.min.css';
// import { IdCard } from "lucide-react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import ReactImageAnnotate from "react-image-annotation";

//this file deals with displaying a "card" or overview of a route, either used in the drafts or current/previous routes part of the website

export const AllCard = ({ name, grade, incline, description, id, notes, timestamp, image, annotations, isAnnotate }) => {

    const [isHovering, setIsHovering] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="allCard" onClick={() => navigate(`/review/${id}`)}>
            {/* for icon buttons (credit below) */}
            <div className="container all-card">
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
                <div className="row">
                    <div className="col-4">
                        <div className={`all-image ${isHovering ? "hover-cursor" : ""}`} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
                            <img src={image}></img>
                            {isHovering &&
                                <div className="overText">
                                    <p> {name} </p>
                                    <p3> {timestamp} </p3>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="">
                            <h1>{name}</h1>
                            <h4>Grade: {grade}</h4>
                            <h4>Incline: {incline}º</h4>
                            <h4>Description: {description} </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllCard;