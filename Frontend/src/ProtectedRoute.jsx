import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
    return sessionStorage.getItem("currUser") !== null; // Checks if the user is logged in
};

const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;