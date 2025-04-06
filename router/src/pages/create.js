import { useEffect, useState } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from 'react-router-dom';
import './create.css';

const Upload = () => {

    // image selected by the "choose file" button 
    const [imageUpload, setImageUpload] = useState(null);
    // image object used to display on screen once image is selected
    const [image, setImage] = useState(null);
    // path of the image to save to firestore
    const [imagePath, setImagePath] = useState("");
    const [isUploaded, setIsUploaded] = useState(false);
    const navigate = useNavigate();

    const uploadImage = () => {
        if (!imageUpload) {
            console.error("No image selected");
            return;
        }
    
        const originalName = imageUpload.name;
        const extension = originalName.substring(originalName.lastIndexOf('.'));
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
