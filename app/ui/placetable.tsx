'use client'
import { useEffect, useState } from "react";
import { getPlaceFromCookie, PlaceData, savePlaceToCookie } from "../lib/cookies"
import LeafletPlaceSelector from "./leaflet-place-selector";


export default function PlaceTable( ){
  
  const [current, setCurrent] = useState<PlaceData | null>(null);
  const [places, setPlaces] = useState<PlaceData[]>([]);
  const [selector, setSelector] = useState(false);
  const [saved, setSaved] = useState(false);
  
  useEffect( () => {
    (async () =>  {
    if(saved == true) {
      // Save only the first place since our cookie structure supports single place
      if (places.length > 0) {
        await savePlaceToCookie(places[0]);
      }
      setSaved(false);
    } else {
      let current = await getPlaceFromCookie();
      console.log(current);
      setCurrent(current);
      if (current) {
        setPlaces([current]);
      }
    }
  })() 
  }  , [saved] )
  
  const up = (place:PlaceData) => {
    let newplaces = places.slice();
    let index = places.findIndex(el => el === place);
    if(index > 0){
      newplaces.splice(index-1, 0, newplaces.splice(index, 1)[0]);
      setPlaces(newplaces);
    }
}

  const down = (place:PlaceData) => {
    let newplaces = places.slice();
    let index = places.findIndex(el => el === place);
    if(index < places.length-1){
      newplaces.splice(index+1, 0, newplaces.splice(index, 1)[0]);
      setPlaces(newplaces);
    }
  }


  const deletePlace = (place: PlaceData) => {
    const newPlaces = places.filter(p => p.name !== place.name);
    setPlaces(newPlaces);
  };

  const toggleSelector = () => setSelector(!selector);

  
  
const addPlace = (placedata:PlaceData):void  =>  {     
  if (placedata.lat &&  placedata.lon &&  placedata.name) {
        setPlaces([placedata, ...places]);
        alert('Place saved successfully!');
    }
  };

const savePlalces = ()  => {
  setSaved(true);
}

const cancel = () => {
  if (current) {
    setPlaces([current]);
  } else {
    setPlaces([]);
  }
}
  

  return (
    <div>
      <div> 
        <button onClick ={savePlalces}>
          Save
        </button>
        <button onClick={cancel}>
          Cancel
        </button>
      </div> 
      <div className="leaflet-add">
         <button onClick={() => toggleSelector() }>
           { selector ? <span className="map close">Close Map</span> : <span className="map open">Add Place</span> }
         </button> 
    { selector && <LeafletPlaceSelector  onsave={ addPlace }  currentPlaces={places} /> }

     </div>
    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">
            Name
          </th>
          <th scope="col" className="px-6 py-3">
            Latitude
          </th>
          <th scope="col" className="px-6 py-3">
            Longitude
          </th>
        </tr>
      </thead>
      <tbody>
        {  places.map((place, index) =>  
        (
          <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
              {place.name}
            </td>
            <td className="px-6 py-4">
              {place.lat}
            </td>
            <td className="px-6 py-4">
              {place.lon}
            </td>
            <td className="px-6 py-4">
              <div>
                <button onClick={() => up(place)}>UP</button>
                <button onClick={() => down(place)}>DOWN</button>
              </div> 
            </td>
            <td className="px-6 py-4">
              <button onClick={() => deletePlace(place)}>
              Delete 
              </button>
              </td>
          </tr>
        )
      ) 
      } 
      </tbody>
    </table>
</div>
 )
}