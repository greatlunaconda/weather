'use client'

import { useState, useRef, useEffect } from 'react';
import { savePlaceToCookie, getPlaceFromCookie, PlaceData } from '../lib/cookies';

export interface LeafletSaveProps {
  onsave: (placedata: PlaceData ) => void;
}

export default function LeafletPlaceSelector({ onsave, currentPlaces }: { onsave: LeafletSaveProps;  currentPlaces : PlaceData[] | []; }) {
  const [placename, setPlaceName] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === 'undefined') return;

      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Dynamically import Leaflet
      const leaflet = await import('leaflet');
      const L = leaflet.default || leaflet;
      
      // Fix for Leaflet default markers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });
      
      // Load saved place from cookie
      const savedPlaceses = currentPlaces;
     
            
      if (mapRef.current && !mapInstance.current) {
        // Initialize Leaflet map
        const map = L.map(mapRef.current);
        navigator.geolocation.getCurrentPosition((pos)=>
          map.setView([pos.coords.latitude, pos.coords.longitude]), (pos) => map.setView([35.689574, 139.693550]));

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapInstance.current = map;

        // Add marker if saved place exists
         savedPlaceses?.forEach(el => {
           L.marker([el.lat, el.lng]).addTo(map);
        });
         


        // Handle map clicks
        map.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          setCoordinates({ lat, lng });
          
    //      Remove existing marker
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }
          
          // Add new marker
          markerRef.current = L.marker([lat, lng]).addTo(map);

          // Get place name using Nominatim (OpenStreetMap's geocoding service)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            if (data.display_name) {
              
              setPlaceName(data.display_name);
            }
          } catch (error) {
            console.error('Geocoding');
          }
        });
      }
    };  
    loadLeaflet();

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
   } , [] );

    return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          value={placename}
          onChange={(e) => setPlaceName(e.target.value)}
          placeholder="Enter place name"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div ref={mapRef} className="w-full h-96 border border-gray-300 rounded mb-4" />
      
      {coordinates && (
        <div className="mb-4 text-sm text-gray-600">
          <p>Latitude: {coordinates.lat.toFixed(6)}</p>
          <p>Longitude: {coordinates.lng.toFixed(6)}</p>
        </div>
      )}
      
      <button
        onClick= {() => coordinates && onsave?.( {"name": placename, "lat": coordinates.lat, "lng":coordinates.lng} as PlaceData)
 } 
        disabled={!placename || !coordinates}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
        >
        Add
      </button>
    </div>
  
  );
}
