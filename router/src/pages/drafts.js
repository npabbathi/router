import RouteProject from "../components/routeProject";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import RouterToast from "../components/toast";


const Drafts = () => {

    const location = useLocation();
    const isDraftMade = location.state?.isDraftMade;

    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
            if (isDraftMade) {
                setToastMessage("Route saved as a draft!");
                setToastType("success");
                setShowToast(true);
        
                const timer = setTimeout(() => {
                    setShowToast(false);
                }, 3000); // hide after 3s
        
                return () => clearTimeout(timer);
            }
        }, [isDraftMade]);

    return (
        <div>
            {showToast && (
                <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999 }}>
                    <RouterToast message={toastMessage} type={toastType} />
                </div>
            )}
            <div className="App">
                <RouteProject />
            </div>
        </div>
    );
};
export default Drafts;
