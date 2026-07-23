import Image from "next/image";
import { fetchWeather, WeatherResult } from '@/app/lib/data';
import { Suspense } from "react";
import Menu from "./ui/menu";
import { getPlacesFromCookie, PlaceData } from "./lib/cookies";
import {Currentrow} from "./ui/currentrow";
import  WeatherSkelton  from "./ui/skelton";
import Row from '@/app/ui/row';

async function RowData({ name, lat, lon, url="" }: { name: string; lat: string; lon: string; url: string}) {
   
  const data: WeatherResult =  await fetchWeather(lat, lon, url);
       
  return (
    <div>
      <Row name={name} weather={data} />
    </div>
  );
}

export default async function Home() {
  const cookies:PlaceData[] = await getPlacesFromCookie();
  console.log('Cookie data:', cookies); // Debug log
 // const showcurrent = true; //  await getShowCurrentPlace()
  const places: {name: string, lat: string, lon: string, url: string}[] = 
    cookies.length > 0 ? cookies.map(cookie => ({'name': cookie.name, 'lat': cookie.lat, 'lon': cookie.lon, 'url': ""})) : [];
  console.log('Places array:', places); // Debug log  

  return (
    <>
     <div className="menu  absolute right-[5%] top-1">
       <Menu />
     </div>
     <div className="mt-[49px] ">
      <Suspense key="current" fallback={<WeatherSkelton/>}>
        <Currentrow />
      </Suspense>
         
         {places &&  places.map((place, index) => 
         <Suspense key={index} fallback={<WeatherSkelton/> }>
           <RowData name={place.name} lat={place.lat} lon={place.lon} url={place.url}  />
         </Suspense>
         )}
  </div>
  </>
  )
}