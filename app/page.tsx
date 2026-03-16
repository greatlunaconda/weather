import Image from "next/image";
import { fetchWeather } from '@/app/lib/data';
import { Suspense } from "react";
import  RowData  from '@/app/ui/rowdata';
import Menu from "./ui/menu";
import { getPlacesFromCookie, getShowCurrentPlace, PlaceData } from "./lib/cookies";
import {Currentrow, CurrentPlaceButton} from "./ui/currentrow";
import {WeatherSkelton} from "./ui/skelton";

export default async function Home() {
  const cookies = await getPlacesFromCookie();
  console.log('Cookie data:', cookies); // Debug log
 // const showcurrent = true; //  await getShowCurrentPlace()
  const places: {name: string, lat: number, lng: number, url: string}[] = 
    cookies.length > 0 ? cookies.map(cookie => ({'name': cookie.name, 'lat': cookie.lat, 'lng': cookie.lon, 'url': ""})) : [];
  console.log('Places array:', places); // Debug log  

  return (
    <>
     <div className="menu  absolute right-[5%] top-1">
      <Menu />

      </div>
  <div className="mt-[49px] ">
     <Currentrow num={places.length} /> 
 {/*   {showcurrent && <Suspense><Currentrow /></Suspense>}*/}
    { places.map((place, index) => 
    <Suspense key={index} fallback={<WeatherSkelton/> }>
      <RowData name={place.name} lat={place.lat} lng={place.lng} url={place.url}  />
    </Suspense>
    )}
  </div>
  </>
  )
}