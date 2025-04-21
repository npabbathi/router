import { useEffect, useState } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { RouteActions } from "../pages/routeActions";
import ReviewCard from "../components/reviewCard";
import Comment from "../components/comment";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import './review.css';
import { db } from "../config/firebase";
import {doc, updateDoc} from "firebase/firestore";
import { useParams } from "react-router-dom";

import ReactImageAnnotate from "react-image-annotation";

const Review = () => {
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const { route, getRouteById } = RouteActions();
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [currentUser, setCurrentUser] = useState(null);


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user ? user.email : null);
        });
        const fetchRoute = async () => {
            await getRouteById(id)
            setIsLoading(false);
        };

        fetchRoute();
    }, []);

    useEffect(() => {
        if (route && route.image) {
            setComments(route.comments);
            setIsLoading(false);
            const imageRef = ref(storage, route.image);
            getDownloadURL(imageRef)
                .then((url) => {
                    setImage(url);
                })
                .catch((error) => {
                    console.error("Failed to get image URL:", error);
                });
        }
    }, [route]);

    const handleAddComment = (e) => {
        e.preventDefault();

        if (!currentUser || !commentText) {
            alert("You must be logged in and provide a comment.");
            return;
        }

        const newComment = { username: currentUser, comment: commentText };
        setComments((prevComments) => [...prevComments, newComment]);
        const routeRef = doc(db, "routes", route.id);
        updateDoc(routeRef, {
            comments: [...comments, newComment]
        })
        setCommentText('');
    };

    if (isLoading) return <div>Loading...</div>;
    if (!route) return <div>Route not found!</div>;

    return (
        <div className="container review-container">
            <div className="col image-section">
            <div className="route-image">
                {/* {image && <img src={image} alt="Route Image" className="route-image" />} */}
                {route.isAnnotate &&  route.annotations?.length > 0 ? (
                <ReactImageAnnotate 
                    src={image} 
                    annotations={route.annotations} 
                    value={route.annotations}
                    showAnnotations={true}
                    // annotation={{ geometry: null, data: {} }}  // prevent 'undefined' errors
                    onChange={() => {}}  // dummy function to suppress errors
                    onSubmit={() => {}}  // another dummy function
                />
                ) : (
                <img 
                    src={image} 
                    alt="Route Preview" 
                />
                )}
                </div>
            </div>
            <div className="col review-col">
                <div className="details-section">
                    <div className="navbar title">ROUTE INFORMATION</div>
                    <ReviewCard
                        name={route.name}
                        grade={route.grade}
                        incline={route.incline}
                        description={route.description}
                        notes={route.notes}
                        timestamp={route.timestamp}
                    />
                </div>
                <div className="comments-section">
                    <div className="title">
                        <div className="navbar">COMMENTS</div>
                    </div>
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <Comment key={index} username={comment.username} comment={comment.comment} className="comment" />
                        ))
                    ) : (
                        <p>No comments yet!</p>
                    )}
                    <form onSubmit={handleAddComment} className="comment-form">
                        <textarea
                            placeholder="Add a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            className="comment-input"
                            required
                        />
                        <button type="submit" className="comment-button">Add Comment</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Review;
