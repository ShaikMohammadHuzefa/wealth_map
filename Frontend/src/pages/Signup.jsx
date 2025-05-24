import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [user, setUser] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user),
            credentials: "include",
        });

        if (response.ok) {
            sessionStorage.setItem("currUser", user.username);
            navigate("/home");
        } else {
            alert("Signup failed!");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>Sign Up</Typography>
                <form onSubmit={handleSignup}>
                    <TextField fullWidth label="Username" margin="normal"
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        required />
                    <TextField fullWidth label="Email" type="email" margin="normal"
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        required />
                    <TextField fullWidth label="Password" type="password" margin="normal"
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        required />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Sign Up
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Signup;