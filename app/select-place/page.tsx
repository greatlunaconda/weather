import { useState } from "react";
import { getPlaceFromCookie, PlaceData } from "../lib/cookies"
import PlaceSelector from "../ui/place-selector";
import PlaceTable from "../ui/placetable";
import LeafletPlaceSelector from "../ui/leaflet-place-selector";

export default async function selectPlace() {
  const currentplaces = await getPlaceFromCookie();

  
  

  return (
    <div>

         < PlaceTable  />
    </div>
 )
}
