'use client'

import { useState, useRef, useEffect } from 'react';
import { savePlaceToCookie, getPlaceFromCookie, PlaceData } from '../lib/cookies';

interface PlaceSelectorProps {
  onPlaceSelect?: (place: PlaceData) => void;
}

export default function PlaceSelector({ onPlaceSelect }: PlaceSelectorProps) {
  const [placeName, setPlaceName] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lon: number } | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    // Load saved place from cookie
    const loadSavedPlace = async () => {
      const savedPlace = await getPlaceFromCookie();
      if (savedPlace) {
        setPlaceName(savedPlace.name);
        setCoordinates({ lat: savedPlace.lat, lon: savedPlace.lon });
      }
    };
    
    loadSavedPlace();

    // Initialize Google Maps
    const initMap = () => {
      if ((window as any).google && mapRef.current) {
        const map = new (window as any).google.maps.Map(mapRef.current, {
          center: coordinates ? { lat: coordinates.lat, lng: coordinates.lon } : { lat: 35.6762, lng: 139.6503 },
          zoom: 10,
        });

        mapInstance.current = map;

        if (coordinates) {
          markerRef.current = new (window as any).google.maps.Marker({
            position: { lat: coordinates.lat, lng: coordinates.lon },
            map: map,
          });
        }

        map.addListener('click', (e: any) => {
          const lat = e.latLng!.lat();
          const lng = e.latLng!.lng();
          
          setCoordinates({ lat, lon: lng });
          
          if (markerRef.current) {
            markerRef.current.setMap(null);
          }
          
          markerRef.current = new (window as any).google.maps.Marker({
            position: { lat, lng },
            map: map,
          });

          // Get place name from coordinates
          const geocoder = new (window as any).google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results: any, status: any) => {
            if (status === 'OK' && results?.[0]) {
              setPlaceName(results[0].formatted_address);
            }
          });
        });
      }
    };
    
    // Delay map initialization to ensure coordinates are loaded
    setTimeout(initMap, 100);
  }, [coordinates]);

  const handleSave = async () => {
    if (placeName && coordinates) {
      const place: PlaceData = {
        name: placeName,
        lat: coordinates.lat,
        lon: coordinates.lon,
      };
      
      await savePlaceToCookie(place);
      onPlaceSelect?.(place);
      alert('Place saved successfully!');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="mb-4">
        <input
          type="text"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          placeholder="Enter place name"
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div ref={mapRef} className="w-full h-96 border border-gray-300 rounded mb-4" />
      
      {coordinates && (
        <div className="mb-4 text-sm text-gray-600">
          <p>Latitude: {coordinates.lat.toFixed(6)}</p>
          <p>Longitude: {coordinates.lon.toFixed(6)}</p>
        </div>
      )}
      
      <button
        onClick={handleSave}
        disabled={!placeName || !coordinates}
        className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
      >
        Save Place
      </button>
    </div>
  );
}