import React, { useEffect, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  useMap,
  useMapEvents,
  CircleMarker,
  ZoomControl
} from 'react-leaflet';
import L from 'leaflet';
import { ATM } from '@/utils/api';
import ATMCard from './ATMCard';

// Fix Leaflet icons
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  atms: ATM[];
  selectedAtm: ATM | null;
  setSelectedAtm: (atm: ATM | null) => void;
  userLocation: [number, number] | null;
  onMapMove: (center: { lat: number; lng: number }) => void;
}

// Component to handle map movement events
const MapEventHandler: React.FC<{ onMapMove: (center: { lat: number; lng: number }) => void }> = ({ onMapMove }) => {
  const map = useMapEvents({
    moveend: () => {
      const center = map.getCenter();
      onMapMove({ lat: center.lat, lng: center.lng });
    },
  });
  return null;
};

// Component to update map view when data changes
const MapUpdateController: React.FC<{
  atms: ATM[];
  selectedAtm: ATM | null;
  userLocation: [number, number] | null;
}> = ({ atms, selectedAtm, userLocation }) => {
  const map = useMap();
  
  useEffect(() => {
    // Set initial view to Vinnytsia
    const vinnytsiaCoords: [number, number] = [49.2331, 28.4682];
    map.setView(vinnytsiaCoords, 13);
    
    // Set map bounds to Vinnytsia region
    const vinnytsiaRadius = 10; // km
    const bounds = L.latLng(vinnytsiaCoords[0], vinnytsiaCoords[1]).toBounds(vinnytsiaRadius * 1000);
    map.setMaxBounds(bounds);
    map.setMinZoom(12);
    map.setMaxZoom(18);
  }, [map]);
  
  useEffect(() => {
    if (selectedAtm) {
      map.setView(
        [selectedAtm.coordinates.latitude, selectedAtm.coordinates.longitude],
        15
      );
    }
  }, [map, selectedAtm]);
  
  return null;
};

const MapView: React.FC<MapViewProps> = ({ 
  atms, 
  selectedAtm, 
  setSelectedAtm,
  userLocation,
  onMapMove
}) => {
  const vinnytsiaCenter: [number, number] = [49.2331, 28.4682];
  
  return (
    <MapContainer
      center={vinnytsiaCenter}
      zoom={13}
      zoomControl={false}
      className="h-full w-full rounded-xl overflow-hidden shadow-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <ZoomControl position="bottomright" />
      
      <MapUpdateController 
        atms={atms} 
        selectedAtm={selectedAtm}
        userLocation={userLocation}
      />
      
      <MapEventHandler onMapMove={onMapMove} />
      
      {userLocation && (
        <CircleMarker 
          center={userLocation}
          radius={8}
          pathOptions={{ 
            fillColor: '#3b82f6', 
            fillOpacity: 0.7,
            color: 'white',
            weight: 2
          }}
        />
      )}
      
      {atms.map(atm => (
        <Marker
          key={atm.id}
          position={[atm.coordinates.latitude, atm.coordinates.longitude]}
          eventHandlers={{
            click: () => {
              setSelectedAtm(atm);
            }
          }}
          opacity={selectedAtm && selectedAtm.id !== atm.id ? 0.7 : 1}
        >
          <Popup closeButton={false} className="atm-popup">
            <ATMCard atm={atm} />
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView;
