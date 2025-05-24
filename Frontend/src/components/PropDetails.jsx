import React, { useState } from "react";

const PropDetails = ({ property, onClose }) => {
  const maxDescriptionLength = 120; // Limit description length
  const [showFull, setShowFull] = useState(false); // Define useState at the top level

  if (!property) return null; // Ensure component doesn't render if no data

  return (
    <div style={{ position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)", zIndex: 1000 }}>
      <div style={{ width: 320, padding: 20, background: "#fff", boxShadow: "0px 4px 8px rgba(0,0,0,0.2)", textAlign: "center" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 5, right: 5 }}>❌</button>
        <h2>{property.address}</h2>
        <p>{property.locality}, {property.region}</p>
        <p><strong>Price:</strong> {property.formatted_price}</p>
        <p>{property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}</p>

        {/* Truncate Description */}
        <p>{showFull ? property.description : `${property.description.substring(0, maxDescriptionLength)}...`}</p>

        {/* Toggle Button */}
        {property.description.length > maxDescriptionLength && (
          <button onClick={() => setShowFull(!showFull)}>
            {showFull ? "Show Less" : "Show More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PropDetails;