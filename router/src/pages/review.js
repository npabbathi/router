import { useEffect, useState } from "react";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";
import { RouteActions } from "../pages/routeActions";
import RouteCard from "../components/routeCard";
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
    ]); // change to get from route info
    const [commentText, setCommentText] = useState('');
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user ? user.email : null);
        });

        const fetchRoute = async () => {
            await getRouteByName("Allison's Test 2.0 ");
            setIsLoading(false);
        };

        fetchRoute();

        const imageRef = ref(storage, "images/IMG_4441_fddd11b0-293e-434a-8c57-766e6d54c783.JPG");
        getDownloadURL(imageRef)
            .then((url) => {
                setImage(url);
            })
            .catch((error) => {
                console.error("Failed to get image URL:", error);
            });

    }, [getRouteByName]);

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

    if (isLoading) {
        return <div>Loading...</div>;
    }


    if (!route) {
        return <div>Route not found!</div>;
    }

    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col">
                        {image && <img src={image} alt="Route Image" className="route-image" />}
                    </div>
                    <div className="col">
                        <div className="row">
                            <RouteCard name={route.name} grade={route.grade} incline={route.incline} description={route.description} notes={route.notes} timestamp={route.timestamp} id={route.id} can_delete={false} />
                        </div>
                        <div className="row">
                            <div className="row">
                                <h3>Comments:</h3>
                                {comments.length > 0 ? (
                                    comments.map((comment, index) => (
                                        <Comment
                                            key={index}
                                            username={comment.username}
                                            text={comment.text}
                                        />
                                    ))
                                ) : (
                                    <p>No comments yet!</p>
                                )}
                            </div>
                            <div className="row">
                                <form onSubmit={handleAddComment}>
                                    <textarea
                                        placeholder="Add Comment"
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        required
                                    />
                                    <button type="submit">Add Comment</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Review;
