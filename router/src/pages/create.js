import { useEffect, useState } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { useNavigate } from 'react-router-dom';

const Upload = () => {

    const [imageUpload, setImageUpload] = useState(null);
    const [image, setImage] = useState(null);
    const [isUploaded, setIsUploaded] = useState(false);
    const navigate = useNavigate();

    const uploadImage = () => {
        if (!imageUpload) {
            console.error("No image selected");
            return;
        }
    
        const uniqueImageName = `${imageUpload.name + v4()}`;
        const imageRef = ref(storage, `images/${uniqueImageName}`);
    
        uploadBytes(imageRef, imageUpload).then(() => {
            return getDownloadURL(imageRef); // Fetch URL for the uploaded image
        }).then((url) => {
            setImage(url);
            setIsUploaded(true);
        }).catch((error) => {
            console.error("Upload failed:", error);
        });
    };
    
    const nextPage = () => {
        navigate('/info', { state: { image } }); // Pass as an object
    };

    return (
        <div>
            <input type="file" onChange={(event) => {setImageUpload(event.target.files[0])}}/>
            <button onClick={uploadImage}>Upload Image</button>
            <img src={image}/>
            {/* {imageList.map((url) => {
                return <img src={url} alt="route"/>
            })} */}
            <button onClick={nextPage} disabled={!isUploaded}>Next</button>
        </div>
    );
};
export default Upload;
