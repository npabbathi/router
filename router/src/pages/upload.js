import { useEffect, useState } from "react";
import { storage } from "../config/firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";

const Upload = () => {

    const [imageUpload, setImageUpload] = useState(null);
    const [imageList, setImageList] = useState([]);

    const imageListRef = ref(storage, "images/");

    const uploadImage = () => {
        if (imageUpload == null) {
            console.error("no image selected")
            return;
        }
        const imageRef = ref(storage, `images/${imageUpload.name + v4()}`);
        uploadBytes(imageRef, imageUpload).then(() => {
            alert(`image /${imageUpload.name} upload`)
        }).then(() => {
            listAll(imageListRef).then((response) => {
                response.items.forEach((item) => {
                    getDownloadURL(item).then((url) => {
                        setImageList((prev) => [...prev, url]);
                    });
                });
            });
        })
    };

    return (
        <div>
            <input type="file" onChange={(event) => {setImageUpload(event.target.files[0])}}/>
            <button onClick={uploadImage}>Upload Image</button>
            <img src={imageList[imageList.length - 1]}/>
            {/* {imageList.map((url) => {
                return <img src={url} alt="route"/>
            })} */}
        </div>
    );
};
export default Upload;
