'use client'

import { useEffect, useState } from "react";
import { DetailType, fetchWeather, isWeatherJson } from "../lib/data";
import Row from "./row";
import{useRef} from 'react';
import { Language } from "../lib/cookies";
import { LangProp } from "../page";

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

export function Currentrow({lang}: {lang: LangProp; }){
  const [weather, setWeather] = useState<{name:string, details:Map<string, DetailType[]>}|null>(null);

  useEffect(() => {
    
      (async () => {
        const newPlace = await getGeoLocation();
      
/*        const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPlace.lat}&lon=${newPlace.lon}&zoom=18&addressdetails=1`
        );
        const nameData = await response.json();
          if (nameData.display_name) {
            setName(nameData.display_name);
        }        
  */      
        const data = await fetchWeather(newPlace.lat,  newPlace.lon, lang[0])
        if (data) {
          console.log("Weather data received");
          setWeather(data);
        }
        
      })();    
  }
      , []);
     console.log("useEffect end");
    return (
      <>
            
        { weather && 
      <div>
        <Row  weather={weather.details} lang={lang[1]} name={weather.name} />          
      </div>
         }
      
       </>
    );
    }

