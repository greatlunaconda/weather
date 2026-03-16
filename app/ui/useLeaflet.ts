i'use-client'

import { useState, useEffect, useRef } from 'react';
import { PlaceData } from '../lib/cookies';

export default function  useLeaflet (mapref:React.RefObject<HTMLDivElement> , currentPlaces: PlaceData[]) {
const [placename, setPlaceName] = useState("");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
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
     
            
      if (mapref.current  && !mapInstance.current) {
        // Initialize Leaflet map
        const map = L.map(mapref.current);
        navigator.geolocation.getCurrentPosition((pos)=> 
          map.setView([pos.coords.latitude, pos.coords.longitude],10), (pos) => map.setView([35.689574, 139.693550, 10])
      );

        // Add OpenStreetMaptiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        mapInstance.current = map;

        // Add marker if saved place exists
        savedPlaceses.forEach?.(el => {
          if (el && typeof el.lat === 'number' && typeof el.lon === 'number') {
            L.marker([el.lat, el.lon]).addTo(map);
          }
        });
         


        // Handle map clicks
        map.on('click', async (e: any) => {
          const { lat, lng } = e.latlng;
          setCoordinates({ lat, lng });
          
          // Remove existing marker
          if (markerRef.current) {
            map.removeLayer(markerRef.current);
          }
          
          // Add new marker
          markerRef.current = L.marker([lat, lng]).addTo(map);

          // Get place name using Nominatim (OpenStreetMap's geocoding service)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'User-Agent': 'WeatherApp/1.0'
                }
              }
            );
            
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Geocoding response:', data); // Debug log
            
            if (data.display_name) {
              setPlaceName(data.display_name);
            } else if (data.address) {
              // Fallback to constructing name from address components
              const parts = [];
              if (data.address.city) parts.push(data.address.city);
              if (data.address.state) parts.push(data.address.state);
              if (data.address.country) parts.push(data.address.country);
              setPlaceName(parts.join(', ') || `Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            } else {
              // Fallback to coordinates
              setPlaceName(`Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
          } catch (error) {
            console.error('Geocoding error:', error);
            // Fallback to coordinates if geocoding fails
            setPlaceName(`Location ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
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
 return {'mapref':mapref, 'coordinates':coordinates, 'placename': placename} ;
  }