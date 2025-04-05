import { useEffect, useState } from "react";
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { RouteActions } from "../pages/routeActions";
import ReviewCard from "../components/reviewCard";
import Comment from "../components/comment";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import './review.css';

const Review = () => {
    const [image, setImage] = useState(null);
    const { route, getRouteByName } = RouteActions();
    const [isLoading, setIsLoading] = useState(true);
    const [comments, setComments] = useState([
        { username: "Alice", text: "This is a great route!" },
        { username: "Bob", text: "Tough but fun!" }
    ]);
    const [commentText, setCommentText] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user ? user.email : null);
        });

        const fetchRoute = async () => {
            await getRouteByName("acm kickoff");
            setIsLoading(false);
        };

        fetchRoute();
    }, [getRouteByName]);

    useEffect(() => {
        if (route && route.imagePath) {
            const imageRef = ref(storage, route.imagePath);
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

        const newComment = { username: currentUser, text: commentText };
        setComments((prevComments) => [...prevComments, newComment]);
        setCommentText('');
    };

    if (isLoading) return <div>Loading...</div>;
    if (!route) return <div>Route not found!</div>;

    return (
        <div className="container">
            <div className="col image-section">
                {image && <img src={image} alt="Route Image" className="route-image" />}
            </div>
            <div className="col">
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
                            <Comment key={index} username={comment.username} text={comment.text} className="comment" />
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
