'use client'

import { useEffect,  useRef, useState } from "react";
import { fetchWeather } from "../lib/data";
import Row from "./row";
import { setServers } from "dns";

export function Currentrow(){
const [place, setPlace] = useState({lat:190, lng:190});
const [name, setName] = useState("");  
const weatherref:any  = useRef(null);
const url = "";
console.log("useeffect invoke");
  useEffect( ()  => {
    const  load = async () => { 
    navigator.geolocation.getCurrentPosition((pos)=> 
          setPlace({lat: pos.coords.latitude, lng: pos.coords.longitude}), (pos) => console.log("something wrong"));
          console.log("current row effect");  
      try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${place.lat}&lon=${place.lng}&zoom=18&addressdetails=1`
            );
            const name = await response.json();
            if (name.display_name) {
              
              setName(name.display_name);
            }
          } catch (error) {
            console.error('Geocoding');
          }
           const data =  await fetchWeather(place.lat, place.lng, "")
      .catch(err => console.error('Failed to fetch weather:', err));
            if (!data) {
              return <div>Loading...</div>;
            }
            console.log("data = " + data);
            weatherref.current = data;
           // console.log("currenrows data"); 
           // console.log(weatherref.current == null );
           // if(data.daily==null){console.log("data is null");} 
  }


         load();
         console.log("useeffect load() ");      
        }, []
        );
     console.log("useEffect end");
    return (
      <div>
        <Row name={name} weather={weatherref.current} />
      </div>
    );
    }

