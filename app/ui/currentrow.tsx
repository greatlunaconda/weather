'use client'

import { useEffect, useState } from "react";
import { fetchWeather } from "../lib/data";
import Row from "./row";

export function Currentrow(){
const [place, setPlace] = useState({lat:190, lng:190});
const [name, setName] = useState("");  
const [weather, setWeather] = useState<any>(null);
console.log("Currentrow component mounted");
  useEffect(() => {
    console.log("useEffect started");
    const load = async () => {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        console.log("geolocation success");
        const newPlace = {lat: pos.coords.latitude, lng: pos.coords.longitude};
        setPlace(newPlace);
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPlace.lat}&lon=${newPlace.lng}&zoom=18&addressdetails=1`
          );
          const nameData = await response.json();
          if (nameData.display_name) {
            setName(nameData.display_name);
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        }
        
        const data = await fetchWeather(newPlace.lat, newPlace.lng, "")
          .catch(err => console.error('Failed to fetch weather:', err));
        if (data) {
          console.log("Weather data received");
          setWeather(data);
        }
      }, (error) => console.log("Geolocation error:", error));
    }
    
    load();
  }, []);
     console.log("useEffect end");
    return (
      <div>
        {weather ? <Row name={name} weather={weather} /> : <div>Loading weather data...</div>}
      </div>
    );
    }

