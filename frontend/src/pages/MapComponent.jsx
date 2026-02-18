import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// icons
const userIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hospitalIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const pharmacyIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const RecenterMap = ({ position }) => {
  const map = useMap();
  React.useEffect(() => {
    if (position) {
      map.setView(position, 15);
    }
  }, [position, map]);
  return null;
};

// Fallback hospitals
const fallbackHospitals = [
  { name: "AIIMS, New Delhi", coords: [28.5672, 77.2100], type: "hospital" },
  { name: "Safdarjung Hospital", coords: [28.5687, 77.2090], type: "hospital" },
  { name: "Apollo Hospital", coords: [28.5375, 77.2874], type: "hospital" },
  { name: "Fortis Hospital, Vasant Kunj", coords: [28.5320, 77.1507], type: "hospital" },
  { name: "Apollo Pharmacy", coords: [28.6139, 77.2090], type: "pharmacy" },
  { name: "MedPlus Pharmacy", coords: [28.6200, 77.2150], type: "pharmacy" },
];

const MapComponent = () => {
  const [position, setPosition] = useState(null);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationMethod, setLocationMethod] = useState("");
  const [error, setError] = useState("");
  const [locationStatus, setLocationStatus] = useState("Initializing...");

  const fetchNearbyPlaces = async (lat, lon) => {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:5000,${lat},${lon});
        node["amenity"="pharmacy"](around:5000,${lat},${lon});
        node["amenity"="clinic"](around:5000,${lat},${lon});
      );
      out geom;
    `;
    
    try {
      const response = await fetch("https://overpass-api.de/api/interpreter", {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
      
      if (!response.ok) {
        throw new Error('Overpass API request failed');
      }
      
      const data = await response.json();
      
      if (data.elements && data.elements.length > 0) {
        const nodes = data.elements
          .filter(el => el.lat && el.lon)
          .map((el) => ({
            name: el.tags?.name || `Unnamed ${el.tags?.amenity}`,
            coords: [el.lat, el.lon],
            type: el.tags?.amenity,
            address: el.tags?.["addr:full"] || el.tags?.["addr:street"] || "Address not available"
          }));
        setPlaces(nodes.slice(0, 20));
      } else {
        console.log("No places found via Overpass API, using fallback");
        setPlaces(fallbackHospitals);
      }
    } catch (err) {
      console.error("Overpass API error:", err);
      setPlaces(fallbackHospitals);
    }
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported by this browser'));
        return;
      }

      setLocationStatus("Requesting location permission...");

  // Check if permission was previously denied
      if ('permissions' in navigator) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'denied') {
            setLocationStatus("Location permission denied. Please enable in browser settings.");
            reject(new Error('Geolocation permission denied'));
            return;
          }
        });
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStatus("GPS location acquired successfully!");
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            method: "GPS"
          });
        },
        (error) => {
          let errorMessage = "GPS location failed: ";
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Permission denied. Please allow location access.";
              setLocationStatus("Location permission denied by user.");
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Location information unavailable.";
              setLocationStatus("GPS signal unavailable.");
              break;
            case error.TIMEOUT:
              errorMessage += "Location request timed out.";
              setLocationStatus("GPS request timed out.");
              break;
            default:
              errorMessage += "Unknown error occurred.";
              setLocationStatus("GPS error occurred.");
              break;
          }
          console.log(errorMessage);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, 
          maximumAge: 60000 
        }
      );
    });
  };

  const getIPLocation = async () => {
    setLocationStatus("Trying IP-based location...");
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        setLocationStatus("Location detected via IP address.");
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          method: "IP Geolocation",
          city: data.city,
          country: data.country_name
        };
      }
      throw new Error('Invalid IP geolocation data');
    } catch (error) {
      setLocationStatus("IP location failed.");
      throw new Error('IP geolocation failed');
    }
  };

  const requestLocationAgain = async () => {
    setLoading(true);
    setError("");
    setLocationStatus("Requesting location again...");
    
    try {
      const gpsLocation = await getUserLocation();
      setPosition([gpsLocation.latitude, gpsLocation.longitude]);
      setLocationMethod(`${gpsLocation.method} (Accuracy: ${Math.round(gpsLocation.accuracy)}m)`);
      await fetchNearbyPlaces(gpsLocation.latitude, gpsLocation.longitude);
    } catch (gpsError) {
      console.log("GPS failed again:", gpsError.message);
      setError("Unable to get precise location. Try allowing location permission in your browser.");
      setLocationStatus("GPS request failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      setLoading(true);
      setError("");
      
      try {
        try {
          const gpsLocation = await getUserLocation();
          setPosition([gpsLocation.latitude, gpsLocation.longitude]);
          setLocationMethod(`${gpsLocation.method} (Accuracy: ${Math.round(gpsLocation.accuracy)}m)`);
          await fetchNearbyPlaces(gpsLocation.latitude, gpsLocation.longitude);
        } catch (gpsError) {
          console.log("GPS failed, trying IP location:", gpsError.message);
         
          const ipLocation = await getIPLocation();
          setPosition([ipLocation.latitude, ipLocation.longitude]);
          setLocationMethod(`${ipLocation.method} - ${ipLocation.city}, ${ipLocation.country} (Approximate)`);
          setError("Using approximate location. Click 'Try GPS Again' for precise location.");
          await fetchNearbyPlaces(ipLocation.latitude, ipLocation.longitude);
        }
      } catch (error) {
        console.error("All location methods failed:", error);
        setError("Could not determine your location. Showing Delhi area with sample data.");
        setPosition([28.6139, 77.2090]); // Default to home
        setLocationMethod("Default Location (Delhi)");
        setLocationStatus("Using default location.");
        setPlaces(fallbackHospitals);
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  const getIconForType = (type) => {
    switch(type) {
      case 'hospital':
      case 'clinic':
        return hospitalIcon;
      case 'pharmacy':
        return pharmacyIcon;
      default:
        return hospitalIcon;
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const placesWithDistance = position ? places.map(place => ({
    ...place,
    distance: calculateDistance(position[0], position[1], place.coords[0], place.coords[1])
  })).sort((a, b) => a.distance - b.distance) : places;

  return (
    <div id="map" className="min-h-screen bg-primary p-25">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Healthcare Locator
          </h1>
          <p className="text-s text-teal-200 max-w-2xl mx-auto">
            Find nearby hospitals, clinics, and pharmacies in your area with real-time location detection
          </p>

          {/* Location Tips incase of GPS error*/}
          {error && error.includes("GPS/Network location unavailable") && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-sm font-semibold text-red-800 mb-2">🔧 Troubleshooting Location Issues</h3>
              <ul className="text-xs text-red-700 text-left space-y-1">
                <li>• <strong>Check Device Settings:</strong> Enable location services in your device settings</li>
                <li>• <strong>Browser Permissions:</strong> Click the location icon (🔒) in address bar → Allow location</li>
                <li>• <strong>Try Different Browser:</strong> Chrome/Firefox usually work better than Safari for location</li>
                <li>• <strong>Move Outside:</strong> GPS works better outdoors with clear sky view</li>
                <li>• <strong>Refresh Page:</strong> Sometimes a page refresh helps reset location services</li>
                <li>• <strong>Check Network:</strong> Ensure you have a stable internet connection</li>
              </ul>
            </div>
          )}
          
          {!position && !error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-2xl mx-auto">
              <h3 className="text-sm font-semibold text-yellow-800 mb-2">💡 Tips for GPS Location</h3>
              <ul className="text-xs text-yellow-700 text-left space-y-1">
                <li>• Make sure to allow location permission when prompted</li>
                <li>• Ensure you're not in private/incognito mode</li>
                <li>• Check that location services are enabled in your browser</li>
                <li>• Try refreshing the page if location fails</li>
                <li>• GPS works best outdoors or near windows</li>
              </ul>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-lg text-white">{locationStatus}</p>
              <p className="text-sm text-gray-400 mt-2">This may take a few seconds...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Map Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6 bg-white">
                <h2 className="text-2xl font-bold text-teal-900 mb-2">Interactive Map</h2>
                <p className="text-sm text-grey-400 mt-1.5">
                  Explore healthcare facilities within 5km radius
                </p>
              </div>
              
              {position && (
                <div className="relative">
                  <MapContainer
                    center={position}
                    zoom={15}
                    style={{
                      height: "500px",
                      width: "100%",
                      zIndex: 0,
                    }}
                  >
                    <RecenterMap position={position} />
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />

                    {/* Search radius circle */}
                    <Circle
                      center={position}
                      radius={5000}
                      pathOptions={{ 
                        color: "#3B82F6", 
                        fillOpacity: 0.1,
                        weight: 2,
                        dashArray: "5, 5"
                      }}
                    />

                    {/* User location */}
                    <Marker position={position} icon={userIcon}>
                      <Popup>
                        <div className="text-center">
                          <strong>📍 Your Location</strong>
                          <br />
                          <small>Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}</small>
                          <br />
                          <small className="text-blue-600">Method: {locationMethod}</small>
                        </div>
                      </Popup>
                    </Marker>

                    {/* Healthcare facilities */}
                    {places.map((place, i) => (
                      <Marker
                        key={i}
                        position={place.coords}
                        icon={getIconForType(place.type)}
                      >
                        <Popup>
                          <div className="min-w-48">
                            <h3 className="font-bold text-gray-800 mb-2">{place.name}</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p><span className="font-medium">Type:</span> {place.type}</p>
                              <p><span className="font-medium">Address:</span> {place.address}</p>
                              {position && (
                                <p><span className="font-medium">Distance:</span> {
                                  calculateDistance(position[0], position[1], place.coords[0], place.coords[1]).toFixed(1)
                                } km</p>
                              )}
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>

                  {/* Map Legend */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 z-[1]">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm">Legend</h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                        <span>Your Location</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                        <span>Hospital/Clinic</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span>Pharmacy</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Quick Stats</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {places.filter(p => p.type === 'hospital' || p.type === 'clinic').length}
                    </div>
                    <div className="text-sm text-red-600 font-medium">Hospitals & Clinics</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {places.filter(p => p.type === 'pharmacy').length}
                    </div>
                    <div className="text-sm text-green-600 font-medium">Pharmacies</div>
                  </div>
                </div>
              </div>

              {/* Nearest Facilities */}
              <div className="bg-white rounded-2xl shadow-xl p-13">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🏥 Nearest Facilities</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {placesWithDistance.slice(0, 8).map((place, i) => (
                    <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                        place.type === 'pharmacy' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">{place.name}</h3>
                        <p className="text-xs text-gray-600 capitalize">{place.type}</p>
                        {place.distance && (
                          <p className="text-xs text-blue-600 font-medium">{place.distance.toFixed(1)} km away</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapComponent;