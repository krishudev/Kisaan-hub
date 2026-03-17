import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Blue icon for the User's Live Location
const UserIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Farm coordinates: KR Mangalam University, Sohna, Haryana (Fallback)
const FARM_LOCATION: [number, number] = [28.271974, 77.06784];

function RecenterAutomatically({ location }: { location: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.flyTo(location, 16, { animate: true, duration: 2 });
    }
  }, [location, map]);
  return null;
}

export function FarmMap({ delay = 0 }: { delay?: number }) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setErrorMsg(null);
        },
        (error) => {
          console.error("Error getting location:", error);
          setErrorMsg("Could not access your live location. Please check browser permissions.");
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setErrorMsg("Geolocation is not supported by your browser.");
    }
  }, []);

  const displayLocation = userLocation || FARM_LOCATION;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: 'spring', stiffness: 100 }}
      className="flex flex-col h-full bg-white dark:bg-slate-900 border-none w-full relative"
    >
      <div className="absolute top-4 left-6 z-[1000] drop-shadow-sm bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          {userLocation ? 'Your Live Location' : 'KR Mangalam University'}
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {userLocation ? 'Live GPS tracking active' : 'Live location offline'}
        </p>
        
        {errorMsg && (
           <p className="text-xs font-medium text-rose-500 mt-2">{errorMsg}</p>
        )}
      </div>
      
      <div className="flex-1 w-full relative z-0">
        <MapContainer 
          center={displayLocation} 
          zoom={13} 
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <RecenterAutomatically location={userLocation} />

          {/* Base Marker Array */}
          <Marker position={FARM_LOCATION}>
            <Popup>
              <strong>ESP32 Sensor Hub</strong> <br />
              KR Mangalam University<br/>
              Status: Active
            </Popup>
          </Marker>

          {/* User Location Marker */}
          {userLocation && (
             <Marker position={userLocation} icon={UserIcon}>
              <Popup>
                <strong>You are here!</strong> <br />
                Live location mode active.
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </motion.div>
  );
}
