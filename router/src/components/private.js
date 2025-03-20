import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    const authToken = localStorage.getItem("token");

    return(
        authToken ? <Outlet/> : <Navigate to="/login"/>
    )
}

export default PrivateRoutes