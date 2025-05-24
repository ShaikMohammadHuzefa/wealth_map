import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const InfoCard = ({ address, lat, lng, onClose }) => {
  if (!address) return null; // Hide if no location is selected

  return (
    <Box
      sx={{
        position: "fixed",           // Changed to fixed for viewport positioning
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,                // Ensures it appears over the map
      }}
    >
      <Card
        sx={{
          width: 300,
          p: 2,
          borderRadius: 3,
          backgroundColor:  "#fff", // Black background
          color:"#000",           // White text
          boxShadow: 3,
          textAlign: "center",
        }}

      >
        <CardContent>
          <button onClick={onClose} style={{ position: "absolute", top: 5, right: 5 }}>❌</button>
          <Typography variant="h6" gutterBottom>
            📍 Location Details
          </Typography>
          <Typography variant="body1">
            <strong>Address:</strong> {address}
          </Typography>
          <Typography variant="body2">
            <strong>Latitude:</strong> {lat.toFixed(6)}
          </Typography>
          <Typography variant="body2">
            <strong>Longitude:</strong> {lng.toFixed(6)}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default InfoCard;