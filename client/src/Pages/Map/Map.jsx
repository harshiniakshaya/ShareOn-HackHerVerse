import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaLocationDot } from "react-icons/fa6";
import ReactDOMServer from "react-dom/server";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const createCustomIcon = (color) => {
  return L.divIcon({
    className: "",
    html: ReactDOMServer.renderToString(
      <FaLocationDot style={{ color, fontSize: "24px" }} />
    ),
  });
};

const Map = () => {
  useEffect(() => {
    console.log("Map component mounted");
  }, []);
  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const addMarker = (lat, lng, name) => {
    setMarkers((prevMarkers) => [...prevMarkers, { lat, lng, name }]);
  };

  useEffect(() => {
    const fetchDonationLocations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/donations");
        const donationLocations = response.data.map((offer) => ({
          lat: offer.latitude,
          lng: offer.longitude,
          name: `${offer.street}, ${offer.city}, ${offer.pincode}`,
        }));
        donationLocations.forEach((location) =>
          addMarker(location.lat, location.lng, location.name)
        );
      } catch (error) {
        console.error("Error fetching donation locations", error);
      }
    };
    fetchDonationLocations();
  }, []);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting the current location: ", error);
        }
      );
    }
  }, []);

  return (
    <div className="mt-[60px]">
      <MapContainer
        center={
          currentLocation
            ? [currentLocation.lat, currentLocation.lng]
            : [20.5937, 78.9629]
        }
        zoom={currentLocation ? 13 : 5}
        style={{ height: "700px", width: "100%" }}
        className="h-full z-10"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={[marker.lat, marker.lng]}
            icon={createCustomIcon("rgb(255, 87, 51)")}
          >
            <Popup>{marker.name}</Popup>
          </Marker>
        ))}

        {currentLocation && (
          <Marker
            position={[currentLocation.lat, currentLocation.lng]}
            icon={createCustomIcon("rgb(34, 139, 34)")}
          >
            <Popup>Your Current Location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
