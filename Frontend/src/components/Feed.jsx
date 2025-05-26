
// Feed.jsx
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import React, { useContext, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { SearchContext } from "../context/SearchContext";
import InfoCard from "./InfoCard";
import PropDetails from "./PropDetails";
import PriceFilter from "./PriceFilter";
import { propertyData } from "../assets/data";
import { useMediaQuery } from "@mui/material";


// Helper: Convert formatted price (e.g. "$40,000") to a numeric value.
function parsePrice(priceString) {
  return Number(priceString.replace(/[^0-9.-]+/g, ""));
}

const drawerWidth = 280;

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;


const Feed = () => {
  const { searchQuery } = useContext(SearchContext);
  const [position, setPosition] = useState([37.0902, -95.7129]);
  const [locationInfo, setLocationInfo] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
   const isMobile = useMediaQuery("(max-width:600px)");
  
  // Process property data to include a numeric price field.
  const propertiesWithPrice = propertyData.map((property) => ({
    ...property,
    price: parsePrice(property.formatted_price),
  }));

  // Determine the min and max prices from the property data.
  const prices = propertiesWithPrice.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  // State for the price range filter.
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  // Reset function to show all properties.
  const resetFilter = () => {
    setPriceRange([minPrice, maxPrice]);
  };

  // Filter properties based on the currently selected price range.
  const filteredProperties = propertiesWithPrice.filter(
    (property) =>
      property.price >= priceRange[0] && property.price <= priceRange[1]
  );

  // Update map center for a new search query.
  useEffect(() => {
    if (!searchQuery) return;

    console.log("Fetching data for:", searchQuery);
    fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length) {
          const bestMatch = data.reduce(
            (prev, curr) =>
              curr.importance > prev.importance ? curr : prev,
            data[0]
          );
          setPosition([parseFloat(bestMatch.lat), parseFloat(bestMatch.lon)]);
        } else {
          console.warn("No valid location found for:", searchQuery);
        }
      })
      .catch((err) => console.error("API Error:", err));
  }, [searchQuery]);

  useEffect(() => {
    if (selectedProperty) {
      console.log("Property Data:", selectedProperty);
    }
  }, [selectedProperty]);

  const MapClickHandler = () => {
    useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        console.log("Clicked Coordinates:", lat, lng);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();

          if (data?.display_name) {
            setLocationInfo({
              address: data.display_name,
              lat,
              lng,
            });
            console.log("Reverse Geocoding Result:", data.display_name);
          } else {
            setLocationInfo({
              address: "Address not found",
              lat,
              lng,
            });
          }
        } catch (error) {
          console.error("Reverse Geocoding Error:", error);
          setLocationInfo({
            address: "Error fetching address",
            lat,
            lng,
          });
        }
      },
    });
    return null;
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", position: "relative" }}>
      {/* Sidebar Drawer for Price Filter, pushed down by NavBar height (64px) */}
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: isMobile ? "110px" : drawerWidth,
          flexShrink: 0,
          
          "& .MuiDrawer-paper": {
          
            width: isMobile ? "110px" : drawerWidth,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", // ✅ Guarantees full height
            justifyContent: "space-between", // ✅ Pushes username down
            paddingBottom: "16px",
            top: "64px", // Offset for NavBar height 
          },
        }}
      >
        <PriceFilter
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          resetFilter={resetFilter}
        />


      </Drawer>

      {/* Main content area with offset for NavBar and Drawer */}
      <Box
        sx={{
          flexGrow: 1,
         mt: "64px",         // Offset for NavBar height
          //ml: `${drawerWidth}px`, // Offset for Drawer width
        }}
      >
        <MapContainer
          center={position}
          key={position.toString()}
          zoom={4}
          scrollWheelZoom={true}
          style={{ height: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {/* Marker for current searched position */}
          <Marker position={position} icon={DefaultIcon}/>
          <MapClickHandler />
          {/* Markers for properties that fall within the price filter */}
          {filteredProperties.map((property, index) => (
            <Marker
              key={index}
              position={[property.latitude, property.longitude]}
              icon={DefaultIcon}
              eventHandlers={{
                click: () => setSelectedProperty(property),
              }}
            />
          ))}
        </MapContainer>
        {/* Display InfoCard or Property Details pop-ups as applicable */}
        {locationInfo && !selectedProperty && (
          <InfoCard
            address={locationInfo.address}
            lat={locationInfo.lat}
            lng={locationInfo.lng}
            onClose={() => setLocationInfo(null)}
          />
        )}
        {selectedProperty && (
          <PropDetails
            property={selectedProperty}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </Box>
    </Box>
  );
};

export default Feed;
