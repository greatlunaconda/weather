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
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    // Load saved place from cookie
    const savedPlace = getPlaceFromCookie();
    if (savedPlace) {
      setPlaceName(savedPlace.name);
      setCoordinates({ lat: savedPlace.lat, lon: savedPlace.lon });
    }

    // Initialize Google Maps
    if (window.google && mapRef.current) {
      const map = new google.maps.Map(mapRef.current, {
        center: savedPlace ? { lat: savedPlace.lat, lng: savedPlace.lon } : { lat: 35.6762, lng: 139.6503 },
        zoom: 10,
      });

      mapInstance.current = map;

      if (savedPlace) {
        markerRef.current = new google.maps.Marker({
          position: { lat: savedPlace.lat, lng: savedPlace.lon },
          map: map,
        });
      }

      map.addListener('click', (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng!.lat();
        const lng = e.latLng!.lng();
        
        setCoordinates({ lat, lon: lng });
        
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }
        
        markerRef.current = new google.maps.Marker({
          position: { lat, lng },
          map: map,
        });

        // Get place name from coordinates
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            setPlaceName(results[0].formatted_address);
          }
        });
      });
    }
  }, []);

  const handleSave = () => {
    if (placeName && coordinates) {
      const place: PlaceData = {
        name: placeName,
        lat: coordinates.lat,
        lon: coordinates.lon,
      };
      
      savePlaceToCookie(place);
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