import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 43.24278,
  lng: 76.894131
};

const GoogleMapComponent: React.FC = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);
        },
        (error) => {
          console.error('Ошибка получения местоположения:', error);
        }
      );
    }
  }, []);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newMarker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };
      setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    }
  };

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || defaultCenter}
        zoom={11}
        onClick={handleMapClick}
      >
        {userLocation && (
          <Marker
            position={userLocation}
            icon={{
              url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            }}
          />
        )}  
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default React.memo(GoogleMapComponent);
