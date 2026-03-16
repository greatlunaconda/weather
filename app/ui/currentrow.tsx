'use client'

import { useEffect, useState } from "react";
import { fetchWeather } from "../lib/data";
import Row from "./row";
import{useRef} from 'react';

export function Currentrow({num}:{num:Number}){
const [place, setPlace] = useState({lat:190, lng:190});
const [name, setName] = useState("");  
const [weather, setWeather] = useState<any>(null);
const [showcurrent, setShowCurrent] = useState(num == 0);
const [loading, setLoading] = useState(false);

console.log("Currentrow component mounted");
  useEffect(() => {
    if (showcurrent){
    setLoading(true);
    console.log("useEffect started");
    (async () => {
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
          setLoading(false);
        }
      }, (error) => console.log("Geolocation error:", error));
    } 
  )();
  
  }
}, []);
     console.log("useEffect end");
    return (
      <>
      <div className={`"absolute top-[3px] left-[10%]"+ ${showcurrent ? " green-100  disabled": " green-800 "}`}>       
        <button onClick={() => setShowCurrent(true)}> Current Place </button> 
        <button onClick={() => setShowCurrent(!false)}> Current Place </button> 
      </div>
      
        {showcurrent && 
        <div>
         loading ?  <div>Loading  data....</div> :
        <Row name={name} weather={weather} />          
         </div>
         }
      
      </>
    );
    }

