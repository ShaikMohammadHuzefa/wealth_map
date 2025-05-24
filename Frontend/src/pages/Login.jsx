import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
            credentials: "include",
        });

        if (response.ok) {
            sessionStorage.setItem("currUser", credentials.username);
            navigate("/home");
        } else {
            alert("Login failed!");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" align="center" gutterBottom>Login</Typography>
                <form onSubmit={handleLogin}>
                    <TextField fullWidth label="Username" margin="normal"
                        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        required />
                    <TextField fullWidth label="Password" type="password" margin="normal"
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        required />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>
                    <Typography align="center" sx={{ mt: 2 }}>
                        Don't have an account?
                    </Typography>
                    <Button variant="outlined" color="secondary" fullWidth sx={{ mt: 1 }}
                        onClick={() => navigate("/signup")}>
                        Sign Up
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;