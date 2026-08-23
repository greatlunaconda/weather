'use client'

import { useEffect, useState } from "react";
import { fetchWeather, WeatherResult, isWeatherJson } from "../lib/data";
import Row from "./row";
import{useRef} from 'react';
import { Language } from "../lib/cookies";

function getGeoLocation(): Promise<{lat:string, lon:string}>{
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition( 
      pos => {   
        const  newPlace:{lat:string, lon:string} = {lat:String(pos.coords.latitude), lon: String(pos.coords.longitude)};
        resolve(newPlace); 
      } 
    ,error => {throw error;  reject(error)})
  })
} 

export function Currentrow({lang}: {lang: Language  }){
const [place, setPlace] = useState({lat:"", lon:""});
const [name, setName] = useState("");  
const [weather, setWeather] = useState<WeatherResult>();
const [showcurrent, setShowCurrent] = useState(true);

console.log("Currentrow component mounted");
  useEffect(() => {
    if (showcurrent){
    console.log("useEffect started");
      (async () => {
        const newPlace = await getGeoLocation();
      
        const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPlace.lat}&lon=${newPlace.lon}&zoom=18&addressdetails=1`
        );
        const nameData = await response.json();
          if (nameData.display_name) {
            setName(nameData.display_name);
        }        
        
        const data = await fetchWeather(newPlace.lat,  newPlace.lon, lang)
        if (data) {
          console.log("Weather data received");
          setWeather(data);
        }
        
      })();
    }
  }
      , []);
     console.log("useEffect end");
    return (
      <>
      <div className={`"absolute top-[3px] left-[10%]"+ ${showcurrent ? " green-100  disabled": " green-800 "}`}>       
        <button onClick={() => setShowCurrent(true)}> Current Place </button> 
        <button onClick={() => setShowCurrent(!false)}> Current Place </button> 
      </div>
      
        {showcurrent && weather && 
      <div>
        <Row name={name} weather={weather} lang={lang} />          
      </div>
         }
      
       </>
    );
    }

