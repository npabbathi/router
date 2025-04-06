import { useEffect, useState } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate, useLocation } from 'react-router-dom';
import "./create.css"
import { RouteActions } from "./routeActions"


const Upload = () => {


    // image selected by the "choose file" button 
    const [imageUpload, setImageUpload] = useState(null);
    // image object used to display on screen once image is selected
    const [image, setImage] = useState(null);
    // path of the image to save to firestore
    const [imagePath, setImagePath] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);
    const navigate = useNavigate();


    // if we're coming from drafts, we want to be able to edit the file
    // const location = useLocation(); 
    // const isEditing = location.state?.isEditing; 
    // const id = location.state?.id; 
    // const routeData = location.state?.routeData; 


    // useEffect(() => { 
    //     if (isEditing) { 
    //         console.log(routeData.imageUrl); 
    //         // setImagePath(routeData.imageUrl); 
    //     }
    // }, []);


    const uploadImage = () => {
        if (!imageUpload) {
            console.error("No image selected");
            return;
        }
    
        const originalName = imageUpload.name;

        // after last . – something like .jpeg
        const extension = originalName.substring(originalName.lastIndexOf('.'));

        // from 0 to . – initial name 
        const baseName = originalName.substring(0, originalName.lastIndexOf('.'));
       
        const uniqueImageName = `${baseName}_${v4()}${extension}`;
        
    
        const imageRef = ref(storage, `images/${uniqueImageName}`);
        const metadata = {
            contentType: imageUpload.type || "image/jpeg",
        };
    
        uploadBytes(imageRef, imageUpload, metadata)
            .then(() => getDownloadURL(imageRef))
            .then((url) => {
                setImage(url);
                setImagePath(`images/${uniqueImageName}`);
                setIsUploaded(true);
            })
            .catch((error) => {
                console.error("Upload failed:", error);
            });
    };
    
    const nextPage = () => {
        navigate('/info', { state: 
            { 
                imageObject : image,
                imagePath : imagePath,
                isEditing : false,
            } 
        }); // Pass as an object
    };


    

    return (
        <div>
            <input type="file" onChange={(event) => {setImageUpload(event.target.files[0])}}/>
            <button className="create-button" onClick={uploadImage}>Upload Image</button>
            <img src={image}/>
            <button className="create-button" onClick={nextPage} disabled={!isUploaded}>Next</button>
        </div>
    );
};
export default Upload;
