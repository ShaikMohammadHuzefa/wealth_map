import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/home";

const isAuthenticated = () => {
    return sessionStorage.getItem("currUser"); // Check if user is logged in
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Redirect "/" to either login or signup if not authenticated */}
                <Route path="/" element={isAuthenticated() ? <Navigate to="/home" /> : <Navigate to="/login" />} />
                
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

export default App;