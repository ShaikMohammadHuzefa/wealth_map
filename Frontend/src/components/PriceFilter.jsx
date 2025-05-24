// PriceFilter.jsx
import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";
import { useMediaQuery } from "@mui/material";


const drawerWidth = 240;

const PriceFilter = ({ priceRange, setPriceRange, minPrice, maxPrice, resetFilter }) => {
   const isMobile = useMediaQuery("(max-width:600px)");
  const handleSliderChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  return (
    <Box sx={{width: isMobile ? "75px" : drawerWidth, p: 2 }}>
      <Typography variant="h10" gutterBottom>
        Filter by Price
      </Typography>
      <Slider
        value={priceRange}
        min={minPrice}
        max={maxPrice}
        step={100000} // Adjust the step as necessary.
        onChange={handleSliderChange}
        valueLabelDisplay="auto"
        sx={{ mt: 4, mb: 2 }}
      />
      <Button variant="outlined" fullWidth onClick={resetFilter}>
        Reset
      </Button>
    </Box>
  );
};

export default PriceFilter;